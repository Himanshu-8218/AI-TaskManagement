import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signin({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/signin", credentials);
      onLogin(response.data.access_token); // Update token state
      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert("Error signing in: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h1>Login to Taskbot</h1>
        <p>An AI-powered Task Management Application</p>
        <form onSubmit={handleSignin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit">Signin</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
