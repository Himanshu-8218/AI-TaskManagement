import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTask from "../components/AddTask";
import YourTasks from "../components/YourTasks";
import Insights from "../components/Insights";
import UpdateTask from "../components/UpdateTask";

function Dashboard({onLogout}) {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    type: "personal",
    status: "not_started",
    priority: 0.5,
  });
  const [filter, setFilter] = useState({ type: "", status: "", sortBy: "" });
  const [currentTab, setCurrentTab] = useState("addTask");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const navigate = useNavigate();

  // Fetch tasks from server
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      alert("Error fetching tasks: " + (err.response?.data?.error || err.message));
    }
  };

  // Handle task creation
  const createTask = async (taskData) => {
    console.log("Data received from AddTask:", taskData); // Debugging
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://127.0.0.1:5000/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Debugging
      alert("Task created successfully.");
      fetchTasks(); // Re-fetch tasks to update UI
    } catch (err) {
      console.error("Error creating task:", err); // Debugging
      alert("Error creating task: " + (err.response?.data?.error || err.message));
    }
  };
  

  // Handle task update
  const updateTask = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
  
      // Check if _id exists and is a valid format
      if (!taskToUpdate._id || taskToUpdate._id.length !== 24) {
        alert("Invalid task ID.");
        return;
      }
  
      // Make sure you pass the correct field for the task ID (_id vs id)
      await axios.put(
        `http://127.0.0.1:5000/tasks/${taskToUpdate._id}`, // Use _id instead of id
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Task updated successfully.");
      setIsUpdateMode(false);
      setCurrentTab("yourTasks");
      fetchTasks(); // Re-fetch tasks to reflect updates
    } catch (err) {
      alert("Error updating task: " + (err.response?.data?.error || err.message));
    }
  };
  

  // Handle task deletion
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
  
      // Call the API to delete the task
      const response = await axios.delete(`http://127.0.0.1:5000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        alert("Task deleted successfully.");
        // Filter out the deleted task from the tasks list
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        alert("Error deleting task.");
      }
    } catch (err) {
      alert("Error deleting task: " + (err.response?.data?.error || err.message));
    }
  };
  

  // Handle logout
  const handleLogout = () => {
    onLogout();
  }

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...tasks];

    if (filter.type) filtered = filtered.filter((task) => task.type === filter.type);
    if (filter.status) filtered = filtered.filter((task) => task.status === filter.status);

    if (filter.sortBy === "due_date") {
      filtered.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    } else if (filter.sortBy === "priority") {
      filtered.sort((a, b) => b.priority - a.priority);
    }

    setTasks(filtered);
  };

  // Set task for update
  const selectTaskForUpdate = (task) => {
    setTaskToUpdate(task);
    setIsUpdateMode(true);
    setCurrentTab("updateTask");
  };

  // Auto-fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>

        

    {/* NAVBAR */}
    <div
      className="navbar"
      style={{
        width: "98%",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2a746c",
        padding: "0.5rem 1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: "0",
        left: "0rem",
        zIndex: "1000",
      }}
    >
      <h2 style={{color:"black", justifyItems:"center", marginBottom:"15px"}}>TASKBOT | AI TASK MANAGEMENT</h2>
      <div style={{ height:"2.5rem",display: "flex", gap: "2rem",left:"40%",position:"fixed" }}>
        
        {!isUpdateMode&& (<button
          onClick={() => setCurrentTab("addTask")}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2a746c",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color:"black",
            fontWeight:"200"
          }}
          onMouseEnter={(e) => (e.target.style.border = "0.5px solid black")}
          onMouseLeave={(e) => (e.target.style.border = "none")}
        >
          Add Task
        </button>)}
        {!isUpdateMode &&(
          <button
          onClick={() => setCurrentTab("yourTasks")}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2a746c",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color:"black",
            fontWeight:"200"
          }}
          onMouseEnter={(e) => (e.target.style.border = "0.5px solid black")}
          onMouseLeave={(e) => (e.target.style.border = "none")}
        >
          Your Tasks
        </button>
        )}
        {!isUpdateMode && (
          <button
          onClick={() => setCurrentTab("insights")}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2a746c",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color:"black",
            fontWeight:"200"
          }}
          onMouseEnter={(e) => (e.target.style.border = "0.5px solid black")}
          onMouseLeave={(e) => (e.target.style.border = "none")}
        >
          Insights
        </button>
        )}
        {/* {isUpdateMode && (
          <button
            onClick={() => setCurrentTab("updateTask")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "rgb(27,80,50)",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "rgb(0,50,20)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "rgb(27,80,50)")}
          >
            Update Task
          </button> 
        )}*/}
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#2a746c",
          cursor: "pointer",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          color:"black",
          fontWeight:"200"
        }}
        onMouseEnter={(e) => (e.target.style.border = "0.5px solid black")}
        onMouseLeave={(e) => (e.target.style.border = "none")}
      >
        Logout
      </button>
    </div>


      {currentTab === "addTask" && (
        <AddTask handleChange={(e) => setTaskData({ ...taskData, [e.target.name]: e.target.value })} createTask={createTask} taskData={taskData} />
      )}
      {currentTab === "yourTasks" && (
        <YourTasks
          tasks={tasks}
          deleteTask={deleteTask}
          filter={filter}
          setFilter={setFilter}
          applyFilters={applyFilters}
          selectTaskForUpdate={selectTaskForUpdate}
        />
      )}
      {currentTab === "insights" && <Insights tasks={tasks} />}
      {currentTab === "updateTask" && taskToUpdate && (
        <UpdateTask
          taskToUpdate={taskToUpdate}
          updateTask={updateTask}
          setIsUpdateMode={setIsUpdateMode}
          setCurrentTab={setCurrentTab}
        />
      )}
    </div>
  );
}

export default Dashboard;
