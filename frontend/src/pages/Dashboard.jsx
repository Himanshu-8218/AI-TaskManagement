import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTask from "../components/AddTask";
import YourTasks from "../components/YourTasks";
import Insights from "../components/Insights";
import UpdateTask from "../components/UpdateTask";

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ type: "", status: "", sortBy: "" });
  const [currentTab, setCurrentTab] = useState("addTask");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const navigate = useNavigate();

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

  const createTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:5000/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task created successfully.");
      fetchTasks();
    } catch (err) {
      alert("Error creating task: " + (err.response?.data?.error || err.message));
    }
  };

  const updateTask = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!taskToUpdate._id || taskToUpdate._id.length !== 24) {
        alert("Invalid task ID.");
        return;
      }

      await axios.put(
        `http://127.0.0.1:5000/tasks/${taskToUpdate._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Task updated successfully.");
      setIsUpdateMode(false);
      setCurrentTab("yourTasks");
      fetchTasks();
    } catch (err) {
      alert("Error updating task: " + (err.response?.data?.error || err.message));
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://127.0.0.1:5000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Task deleted successfully.");
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        alert("Error deleting task.");
      }
    } catch (err) {
      alert("Error deleting task: " + (err.response?.data?.error || err.message));
    }
  };

  const generateTitle = async (description) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-title",
        { description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.generated_title;
    } catch (error) {
      console.error("Error generating title:", error);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  const selectTaskForUpdate = (task) => {
    setTaskToUpdate(task);
    setIsUpdateMode(true);
    setCurrentTab("updateTask");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary navbar-dark fixed-top shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold">TASKBOT | GEN-AI TASK MANAGEMENT</span>
          <div className="d-flex align-items-center gap-2">
            {!isUpdateMode && (
              <>
                <button className="btn btn-outline-light btn-sm" onClick={() => setCurrentTab("addTask")}>Add Task</button>
                <button className="btn btn-outline-light btn-sm" onClick={() => setCurrentTab("yourTasks")}>Your Tasks</button>
                <button className="btn btn-outline-light btn-sm" onClick={() => setCurrentTab("insights")}>Insights</button>
              </>
            )}
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-5 pt-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12">
            {currentTab === "addTask" && (
              <AddTask createTask={createTask} generateTitle={generateTitle} />
            )}

            {currentTab === "yourTasks" && (
              <YourTasks
                tasks={tasks}
                deleteTask={deleteTask}
                filter={filter}
                setFilter={setFilter}
                applyFilters={() => {}}
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
