import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Import an icon for the header

function UpdateTask({
  taskToUpdate,
  setIsUpdateMode,
  setCurrentTab,
  updateTask, // Receive the updateTask function from the parent
}) {
  const [taskData, setTaskData] = useState({ ...taskToUpdate });
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  // Handle input changes to update task data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle cancel action to return to task list
  const handleCancel = () => {
    setIsUpdateMode(false);
    setCurrentTab("yourTasks");
  };

  // Submit the updated task data to the parent function
  const handleUpdate = async () => {
    setIsLoading(true); // Start loading state
    await updateTask(taskData); // Call the parent's updateTask function with the updated data
    setIsLoading(false); // End loading state
  };

  // Update taskData when taskToUpdate changes
  useEffect(() => {
    setTaskData({ ...taskToUpdate });
  }, [taskToUpdate]);

  return (
    <div className="updateTaskForm">
      <div className="task-header">
        <FaEdit className="task-icon" />
        <h2>Update Task</h2>
      </div>
      <div className="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            name="title"
            className="form-control"
            placeholder="Task Title"
            value={taskData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Task Description"
            value={taskData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            className="form-control"
            value={taskData.due_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={taskData.type}
            onChange={handleChange}
          >
            <option value="personal">Personal</option>
            <option value="weekend">Weekend</option>
            <option value="official">Official</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={taskData.status}
            onChange={handleChange}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Priority</label>
          <input
            id="priority"
            name="priority"
            type="number"
            min="0"
            max="1"
            step="0.1"
            className="form-control"
            placeholder="Priority (0 to 1)"
            value={taskData.priority}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTask;
