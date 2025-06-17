import React, { useState } from "react";
import { FaPlus, FaCalendarAlt, FaTag, FaFlag, FaMagic, FaTasks } from "react-icons/fa";

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
      <div className="task-header">
        <FaTasks className="task-icon" />
        <h2>Create New Task</h2>
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📝</span>
            Task Title
          </label>
          <input
            name="title"
            placeholder="Enter a descriptive title for your task"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
          {generatedTitle && (
            <div className="generated-title">
              <span className="badge">Generated</span>
              {generatedTitle}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📋</span>
            Description
          </label>
          <div className="d-flex gap-2">
            <textarea
              name="description"
              placeholder="Provide detailed information about your task..."
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              style={{ width: '90%' }}
              rows="3"
              required
            />
            <button 
              type="button" 
              onClick={handleGenerateTitle}
              className="btn btn-outline-primary generate-btn"
              title="Generate title from description"
              style={{ width: '10%', height: 'fit-content' }}
            >
              <FaMagic className="me-1" />
              
            </button>
          </div>
        </div>

        <div className="form-section">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">
                <FaCalendarAlt className="me-1" />
                Due Date
              </label>
              <input
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                <FaTag className="me-1" />
                Task Type
              </label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="personal">Personal</option>
                <option value="weekend">Weekend</option>
                <option value="official">Official</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                <FaFlag className="me-1" />
                Status
              </label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="form-group mt-2">
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Priority Scale
            </label>
            <select 
              name="scale" 
              value={formData.scale} 
              onChange={handleChange}
              className="form-select"
            >
              <option value="scale1">Low Priority</option>
              <option value="scale2">Medium Priority</option>
              <option value="scale3">High Priority</option>
            </select>
          </div>
        </div>

        <div className="form-group mt-3 text-center">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg create-btn"
          >
            <FaPlus className="me-2" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
