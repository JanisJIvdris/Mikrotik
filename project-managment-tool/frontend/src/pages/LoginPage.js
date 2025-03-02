import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import ErrorIcon from "../assets/icons/ErrorIcon";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="header-title">Login</h1>
      </div>
      <div className="card">
        {error && (
          <div
            className="summary-card icon-red"
            style={{ marginBottom: "20px" }}
          >
            <div className="icon-container icon-red">
              <ErrorIcon className="icon" />
            </div>
            <p className="stats-text">{error}</p>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="filter-group">
            <label className="filter-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
