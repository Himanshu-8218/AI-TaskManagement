import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function YourTasks({ tasks, deleteTask, selectTaskForUpdate }) {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filter, setFilter] = useState({ type: "", status: "", sortBy: "" });
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter and sort tasks whenever tasks or filters change
  useEffect(() => {
    let updatedTasks = [...tasks];

    // Apply filters
    if (filter.type) {
      updatedTasks = updatedTasks.filter((task) => task.type === filter.type);
    }
    if (filter.status) {
      updatedTasks = updatedTasks.filter((task) => task.status === filter.status);
    }

    // Apply sorting
    if (filter.sortBy === "due_date") {
      updatedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    } else if (filter.sortBy === "priority") {
      updatedTasks.sort((a, b) => b.priority - a.priority);
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div >
      {selectedTask ? (
        // Task Detail View
        <div style={{position:"fixed",left:"26%",top:"20%", padding: "1rem" ,width:"50%",backgroundColor:"#e3ded4",boxShadow: "2px 5px 10px rgba(0, 0, 0, 0.65)",borderRadius:"2.5px"}}>
          <button
            onClick={() => setSelectedTask(null)} // Go back to the summary list
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "rgb(0, 0, 0)",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Back to Tasks
          </button>
          <h2>Task Details</h2>
          <h3><strong>Title: </strong>{selectedTask.title}</h3>
          <p><strong>Description:</strong> {selectedTask.description}</p>
          <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
          <p><strong>Type:</strong> {selectedTask.type}</p>
          <p><strong>Status:</strong> {selectedTask.status}</p>
          <p>
            <strong>Priority:</strong>{" "}
            {selectedTask.priority && !isNaN(selectedTask.priority)
              ? Number(selectedTask.priority).toFixed(2)
              : 0}
          </p>
          <button
            onClick={() => selectTaskForUpdate(selectedTask)} // Trigger update mode
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Edit Task
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent task detail view trigger
            
              // Optimistically remove the task
              deleteTask(selectedTask._id);
            
              // Immediately reset selectedTask to avoid showing deleted details
              setSelectedTask(null);
            }} // Delete the task
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#dc3545",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete Task
          </button>
        </div>
      ) : (
        // Task Summary View
        <div style={{width:"100%",height:"100vh"}} >
          <h2 style={{display:"flex",position:"fixed",top:"3.5rem",left:"45%"}}>Your Tasks</h2>

          {/* Filter Section */}
          <div
            className="filter"
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <select name="type" value={filter.type} onChange={handleFilterChange}>
              <option value="">Filter by Type</option>
              <option value="personal">Personal</option>
              <option value="weekend">Weekend</option>
              <option value="official">Official</option>
            </select>

            <select name="status" value={filter.status} onChange={handleFilterChange}>
              <option value="">Filter by Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">completed</option>
            </select>

            <select name="sortBy" value={filter.sortBy} onChange={handleFilterChange}>
              <option value="">Sort by</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        <br/>
          {/* Task Summary List */}
        <div className="task-content" style={{display:"block",overflowY:"-moz-hidden-unscrollable",justifyContent:"centre",alignItems:"centre",marginTop:"40%"}}>
          <ul style={{marginLeft:"40%",display:"block",width:"100%"}}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <li
                  key={task._id}
                  style={{
                    border: "1px solid #ccc",
                    boxShadow: "2px 5px 10px rgba(0, 0, 0, 0.65)",
                    borderRadius: "3px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    // marginLeft: "80px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor:"rgba(42,116,108,0.3)",
                    width:"100%",
                  }}
                  onClick={() => setSelectedTask(task)} // Show task details on click
                >
                  <div>
                    <h3>Title: {task.title}</h3>
                    <p>Due Date: {task.due_date}</p>
                    <p>
                      Priority:{" "}
                      {task.priority && !isNaN(task.priority)
                        ? Number(task.priority).toFixed(2)
                        : 0}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {/* Update Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent task detail view trigger
                        selectTaskForUpdate(task);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#007bff",
                      }}
                      title="Update Task"
                    >
                      <FaEdit size={20} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent task detail view trigger
                        deleteTask(task._id);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#dc3545",
                      }}
                      title="Delete Task"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No tasks match the filter. Try adjusting your filters!</p>
            )}
          </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourTasks;
