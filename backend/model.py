import warnings
import pandas as pd
import numpy as np
import nltk
import dill
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from lightgbm import LGBMRegressor
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split, GridSearchCV
import json
from sklearn.metrics import mean_absolute_error


nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('stopwords')

lemmatizer = WordNetLemmatizer()

warnings.filterwarnings("ignore")

with open('temp.json', 'r') as file:
    df = json.load(file)

data = pd.DataFrame(df['tasks'])
def lemmatize_text(text):
  words = nltk.word_tokenize(text)
  # words = [word for word in words if word.lower() not in stop_words]
  lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
  return ' '.join(lemmatized_words)

def calculate_remaining_days(due_date):
  today_date = pd.Timestamp('today').normalize().date()
  return (pd.to_datetime(due_date) - pd.to_datetime(today_date)).dt.days

data['due_date'] = pd.to_datetime(data['due_date'])
data['remaining_days'] = calculate_remaining_days(data['due_date'])
data = data[(data['status'] != 'completed')]


data.drop(columns=['due_date'], inplace=True)


categorical_features = ['type', 'status']
text_features = ['title', 'description']
categorical_transformer = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

text_preprocessor = ColumnTransformer(
    transformers=[
        ('title_tfidf', TfidfVectorizer(preprocessor=lemmatize_text, max_features=500), 'title'),
        ('desc_tfidf', TfidfVectorizer(preprocessor=lemmatize_text,max_features=500), 'description'),
    ],
    # remainder='passthrough'
    remainder='drop'
)

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', categorical_transformer, categorical_features),
        ('text', text_preprocessor, text_features),
        ('num', StandardScaler(), ['remaining_days'])
    ],
    remainder='drop'
)

pipeline = Pipeline([
    ('preprocessing', preprocessor),
    ('scaler', StandardScaler(with_mean=False)),
    ('regressor', LGBMRegressor(n_jobs=-1,device='cpu'))
])

param_grid = {
    'regressor__boosting_type': ['gbdt'],  
    'regressor__num_leaves': [10],         
    'regressor__max_depth': [-1],         
    'regressor__learning_rate': [0.01],
    'regressor__n_estimators': [400],    
    'regressor__subsample': [0.8],       
    'regressor__colsample_bytree': [0.8],     
    'regressor__min_child_samples': [35],  
    'regressor__reg_alpha': [0.1],       
    'regressor__reg_lambda': [0.1],       
    'regressor__objective': ['regression'],  
    'regressor__metric': ['mae'],          
    'regressor__min_split_gain': [0.005] 
}

X = data.drop(columns=['priority','id'])
y = data['priority']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,random_state=73)

grid = GridSearchCV(pipeline, param_grid, cv=7, scoring='r2')
grid_result = grid.fit(X_train, y_train)

print("Best parameters found: ", grid_result.best_params_)
best_model = grid_result.best_estimator_

y_pred = grid_result.predict(X_test)
y_pred = np.round(y_pred, 2)

from sklearn.metrics import r2_score
r2 = r2_score(y_test,y_pred)
print(f"Accuracy: {r2*100}")

# mae = mean_absolute_error(y_test, y_pred)
# print(f"MAE score is : {mae}")

with open('best_model.pkl', 'wb') as file:
    dill.dump(best_model, file)