import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCalendarAlt, FaFlag } from "react-icons/fa";

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
    <div className="min-vh-100 d-flex flex-column" style={{width: "100%"}}>
      {selectedTask ? (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="card p-4 shadow" style={{ width: "90%", maxWidth: "800px", backgroundColor: 'white' }}>
            <button className="btn btn-outline-primary mb-3" onClick={() => setSelectedTask(null)}>
              Back to Tasks
            </button>
            <h2 className="mb-4 text-center">Task Details</h2>
            <div className="task-details">
              <div className="mb-3">
                <h4 className="text-primary">Title</h4>
                <p className="lead">{selectedTask.title}</p>
              </div>
              <div className="mb-3">
                <h4 className="text-primary">Description</h4>
                <p>{selectedTask.description}</p>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <h4 className="text-primary">Due Date</h4>
                  <p><FaCalendarAlt className="me-2" />{selectedTask.due_date}</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-primary">Type</h4>
                  <p>{selectedTask.type}</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-primary">Status</h4>
                  <p>{selectedTask.status}</p>
                </div>
              </div>
              <div className="mb-3">
                <h4 className="text-primary">Priority</h4>
                <p><FaFlag className="me-2" />{selectedTask.priority ? Number(selectedTask.priority).toFixed(2) : 0}</p>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={() => selectTaskForUpdate(selectedTask)}>Edit Task</button>
              <button className="btn btn-danger" onClick={() => { deleteTask(selectedTask._id); setSelectedTask(null); }}>Delete Task</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container flex-grow-1 d-flex flex-column py-4">
          <h2 className="text-center mb-4 text-primary">Your Tasks</h2>
          <div className="filter">
            <select className="form-select" name="type" value={filter.type} onChange={handleFilterChange}>
              <option value="">Filter by Type</option>
              <option value="personal">Personal</option>
              <option value="weekend">Weekend</option>
              <option value="official">Official</option>
            </select>
            <select className="form-select" name="status" value={filter.status} onChange={handleFilterChange}>
              <option value="">Filter by Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select className="form-select" name="sortBy" value={filter.sortBy} onChange={handleFilterChange}>
              <option value="">Sort by</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="container justify-content-center align-items-center flex-grow-1">
            <div className="mx-auto" style={{ width: '100%', overflowY: 'auto', maxHeight: '70vh' }}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="task-card"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 className="mb-2">{task.title}</h4>
                        <div className="task-meta">
                          <span><FaCalendarAlt className="me-1" />{task.due_date}</span>
                          <span><FaFlag className="me-1" />{task.priority && !isNaN(task.priority) ? Number(task.priority).toFixed(2) : "COMPLETED"}</span>
                        </div>
                      </div>
                      <div className="task-actions">
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