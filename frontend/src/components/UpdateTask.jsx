import React, { useState, useEffect } from "react";

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
    <div className="updateTask">
      <h2>Update Task</h2>
      <label name="title">Title</label>
      <input
        name="title"
        placeholder="Title"
        value={taskData.title}
        onChange={handleChange}
      />
      <label name="description">Description</label>
      <input
        name="description"
        placeholder="Description"
        value={taskData.description}
        onChange={handleChange}
      />
      <label name="due_date">Due date</label>
      <input
        name="due_date"
        type="date"
        value={taskData.due_date}
        onChange={handleChange}
      />
      <label name="type">Type</label>
      <select name="type" value={taskData.type} onChange={handleChange}>
        <option value="personal">Personal</option>
        <option value="weekend">Weekend</option>
        <option value="official">Official</option>
      </select>
      <label name="status">Status</label>
      <select name="status" value={taskData.status} onChange={handleChange}>
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">completed</option>
      </select>
      <br></br>
      <label name="priority">Priority</label>
      <input
        name="priority"
        type="number"
        min="0"
        max="1"
        placeholder="Priority (0 to 1)"
        value={taskData.priority}
        onChange={handleChange}
      />
      <button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Task"}
      </button>
      <button onClick={handleCancel} disabled={isLoading}>
        Cancel
      </button>
    </div>
  );
}

export default UpdateTask;
