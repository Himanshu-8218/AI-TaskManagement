import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/signup", { username,email, password });
      alert("Signup successful! Redirecting to login...");
      navigate("/signin");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };





  return (
        <div className="container">
          <div className="login-form">
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          required/>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          required/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          required/>
          <button onClick={handleSignup}>Register</button>
          <p>
        Already have an account? <a href="/signin">Sign In</a>
        </p>
          </div>
          
        </div>
  );

}

export default Signup;
