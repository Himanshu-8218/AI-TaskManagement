from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS
import numpy as np
from bson import ObjectId
import pandas as pd
import nltk
import dill
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('stopwords')


with open('best_model.pkl', 'rb') as file:
    loaded_model = dill.load(file)



def preprocess(df):
    today_date = pd.Timestamp('today').normalize().date()
    df['remaining_days'] = (pd.to_datetime(df['due_date']) - pd.to_datetime(today_date)).dt.days
    df.loc[df['status'] == 'completed', 'remaining_days'] = 0
    df=df.drop(columns=['due_date'])
    return  loaded_model.predict(df)

# Creating Flask Instance
app = Flask(__name__)
CORS(app)
# Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/Taskbot"  # Update with your MongoDB URI
app.config["JWT_SECRET_KEY"] = "12xyz98654pgqkksl"  # Replace with a secure key
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

#Collection for User and Tasks
users_collection = mongo.db.users
tasks_collection = mongo.db.tasks

#Connecting to Database
try:
    mongo.db.list_collection_names()
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

# Routes
@app.route("/")
def home():
    return "<h>Welcome</h>"

# Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username,email and password are required"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    users_collection.insert_one({"username": username,"email":email ,"password": hashed_password})

    return jsonify({"message": "User created successfully, redirecting to login page..."}), 201

# Signin
@app.route("/signin", methods=["POST"])
def signin():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = users_collection.find_one({"username": username})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create a JWT token
    access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
    return jsonify({"message": "Login successful", "access_token": access_token}), 200

# Logout (handled client-side, no token invalidation mechanism here)
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logged out successfully, redirecting to login page..."}), 200

##NEW


@app.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    current_user = get_jwt_identity()
    data = request.json

    # Prepare the data for preprocessing
    input_data = pd.DataFrame([{
        "title": data.get("title"),
        "description": data.get("description"),
        "due_date": data.get("due_date"),
        "status": data.get("status", "not_started"),
        "type": data.get("type")
    }])

    # Predict priority using the preprocess function
    try:
        predicted_priority = float(preprocess(input_data)[0])  # Get the first prediction (assuming one row)
    except Exception as e:
        return jsonify({"error": f"Failed to predict priority: {str(e)}"}), 400
    
    scale_factor={"scale1":0.96,"scale2":0.42,"scale3":0.12}

    temp_priority=round(predicted_priority*0.8+0.2*scale_factor[data.get("scale")],2)

    # Create the task with the predicted priority
    task = {
        "title": data.get("title"),
        "description": data.get("description"),
        "due_date": data.get("due_date"),
        "type": data.get("type"),
        "status": data.get("status", "not_started"),
        "priority": temp_priority,  # Use the predicted priority
        "username": current_user
    }

    # Insert the task into the database
    tasks_collection.insert_one(task)
    return jsonify({"message": "Task created successfully"}), 201


# Get All Tasks
@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    current_user = get_jwt_identity()
    tasks = list(tasks_collection.find({"username": current_user}))
    for task in tasks:
        task["_id"] = str(task["_id"])  # Convert ObjectId to string
    return jsonify(tasks), 200


# Update Task
@app.route("/tasks/<task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    current_user = get_jwt_identity()
    data = request.json

    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id), "username": current_user})
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        temp_priority=data.get("priority", task["priority"])
        if(data.get("status", task["status"])=="completed"):
            temp_priority=0
        tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {
                "title": data.get("title", task["title"]),
                "description": data.get("description", task["description"]),
                "due_date": data.get("due_date", task["due_date"]),
                "type": data.get("type", task["type"]),
                "status": data.get("status", task["status"]),
                "priority": temp_priority,
            }}
        )
        return jsonify({"message": "Task updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Task
@app.route("/tasks/<task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    current_user = get_jwt_identity()

    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id), "username": current_user})
        if result.deleted_count == 0:
            return jsonify({"error": "Task not found"}), 404

        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
