import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function YourTasks({ tasks, deleteTask, selectTaskForUpdate }) {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filter, setFilter] = useState({ type: "", status: "", sortBy: "" });
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let updatedTasks = [...tasks];

    if (filter.type) {
      updatedTasks = updatedTasks.filter((task) => task.type === filter.type);
    }
    if (filter.status) {
      updatedTasks = updatedTasks.filter((task) => task.status === filter.status);
    }

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
    <div className="min-vh-100 d-flex flex-column" style={{width: "50rem"}}>
      {selectedTask ? (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="card p-4 shadow" style={{ width: "90%", maxWidth: "800px" }}>
            <button className="btn btn-dark mb-3" onClick={() => setSelectedTask(null)}>
              Back to Tasks
            </button>
            <h2 className="mb-3 text-center">Task Details</h2>
            <h4><strong>Title:</strong> {selectedTask.title}</h4>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
            <p><strong>Type:</strong> {selectedTask.type}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Priority:</strong> {selectedTask.priority ? Number(selectedTask.priority).toFixed(2) : 0}</p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={() => selectTaskForUpdate(selectedTask)}>Edit Task</button>
              <button className="btn btn-danger" onClick={() => { deleteTask(selectedTask._id); setSelectedTask(null); }}>Delete Task</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container flex-grow-1 d-flex flex-column py-4 mt-7" style={{width: '100%'}}>
            <h2 className="text-center mb-4 text-primary">Your Tasks</h2>
            <div className="row g-3 mb-4 justify-content-center">
              <div className="col-md-3">
                <select className="form-select" name="type" value={filter.type} onChange={handleFilterChange}>
                  <option value="">Filter by Type</option>
                  <option value="personal">Personal</option>
                  <option value="weekend">Weekend</option>
                  <option value="official">Official</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" name="status" value={filter.status} onChange={handleFilterChange}>
                  <option value="">Filter by Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" name="sortBy" value={filter.sortBy} onChange={handleFilterChange}>
                  <option value="">Sort by</option>
                  <option value="due_date">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          <div className="container justify-content-center align-items-center flex-grow-1">

            <div className="mx-auto" style={{ width: '100%',overflowY: 'scroll', maxHeight: '70vh' }}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="card mb-3 shadow-sm p-3"
                    style={{ 
                      backgroundColor: "#f8f9fa",
                      borderLeft: "6px solid #2a746c",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div >
                        <h4 className="mb-2 text-dark">{task.title}</h4>
                        <div className="d-flex gap-3">
                          <small className="text-muted">Due: {task.due_date}</small>
                          <small className="text-secondary">
                            Priority: {task.priority && !isNaN(task.priority) ? Number(task.priority).toFixed(2) : "COMPLETED"}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectTaskForUpdate(task);
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task._id);
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-warning text-center">
                  No tasks match the filter. Try changing filters!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourTasks;