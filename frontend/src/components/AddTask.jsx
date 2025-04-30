import React, { useState } from "react";

function AddTask({ createTask, generateTitle }) {
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
    setGeneratedTitle("Generating...");
    const newTitle = await generateTitle(formData.description);
    if (newTitle) {
      setGeneratedTitle(newTitle);
      setFormData((prev) => ({
        ...prev,
        title: newTitle,
      }));
    } else {
      setGeneratedTitle("Failed to generate title");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.due_date) {
      alert("Please fill out all fields before submitting!");
      return;
    }
    createTask(formData);
    setFormData({
      title: "",
      description: "",
      due_date: "",
      type: "personal",
      status: "not_started",
      scale: "scale1",
    });
    setGeneratedTitle("");
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
