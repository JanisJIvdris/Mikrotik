import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Dashboard.css";
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
            className="summary-card"
            style={{ backgroundColor: "#ffebee", marginBottom: "20px" }}
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
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
