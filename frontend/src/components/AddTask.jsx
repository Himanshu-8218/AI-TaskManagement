import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios

function AddTask({ createTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    type: "personal",
    status: "not_started",
    scale: "scale1",
  });

  const [generatedTitle, setGeneratedTitle] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateTitle = async () => {
    try {
      const response = await axios.post(
        "/generate-title",
        { description: formData.description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      setGeneratedTitle(response.data.generated_title); // Update state with the generated title
    } catch (error) {
      console.error("Error generating title:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      scale: "scale1",
    });
  };

  return (
    <div className="createTask">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title || generatedTitle}  // Show generated title if exists
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
        <button type="button" onClick={handleGenerateTitle}>
          Generate Title
        </button>
        <input
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="personal">Personal</option>
          <option value="weekend">Weekend</option>
          <option value="official">Official</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
        </select>
        <select name="scale" value={formData.scale} onChange={handleChange}>
          <option value="scale1">Scale 1</option>
          <option value="scale2">Scale 2</option>
          <option value="scale3">Scale 3</option>
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default AddTask;
