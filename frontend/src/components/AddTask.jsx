import React, { useState } from "react";

function AddTask({ createTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    type: "personal",
    status: "not_started",
    scale:"scale1"
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
      scale:"scale1"
    });
  };

  return (
    <div className="createTask">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
      {/* <label name="title">Title</label> */}
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {/* <label name="description">Description</label> */}
        <input
          style={{width:"87%"}}
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button style={{width:"7%",backgroundColor:"#0b0bb3"} } onClick={()=>NULL}>✨</button>
        {/* <label name="due_date">Due date</label> */}
        <input
          id="duedate"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          required
          style={{width:"30%"}}
        />
        {/* <label name="type">Type</label> */}
        <select name="type" value={formData.type} onChange={handleChange} style={{width:"33%"}}>
          <option value="personal">Personal</option>
          <option value="weekend">Weekend</option>
          <option value="official">Official</option>
        </select>
        {/* <label name="status">Status</label> */}
        <select name="status" value={formData.status} onChange={handleChange} style={{width:"33%"}}>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          {/* <option value="completed">completed</option> */}
        </select>
        <select name="scale" value={formData.scale} onChange={handleChange} style={{width:"33%"}}>
          <option value="scale1">Scale 1</option>
          <option value="scale2">Scale 2</option>
          <option value="scale3">Scale 3</option>
          {/* <option value="completed">completed</option> */}
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default AddTask;
