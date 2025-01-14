import React, { useState } from "react";

function AddTask({ createTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    type: "personal",
    status: "not_started",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before submission:", formData); // Debugging
    if (!formData.title || !formData.description || !formData.due_date) {
      alert("Please fill out all fields before submitting!");
      return;
    }
    createTask(formData); // Pass formData to createTask function
    setFormData({
      title: "",
      description: "",
      due_date: "",
      type: "personal",
      status: "not_started",
    });
  };

  return (
    <div className="createTask">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          id="duedate"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="personal">Daily</option>
          <option value="weekend">Weekend</option>
          <option value="official">Official</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">completed</option>
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default AddTask;
