import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../components/Dashboard.css";
import ErrorIcon from "../assets/icons/ErrorIcon";
import SuccessIcon from "../assets/icons/SuccessIcon";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", { username, password });
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="header-title">Register</h1>
      </div>
      <div className="card">
        {message && (
          <div
            className="summary-card"
            style={{
              backgroundColor: message.includes("failed")
                ? "#ffebee"
                : "#e8f5e9",
              marginBottom: "20px",
            }}
          >
            <div
              className={`icon-container ${
                message.includes("failed") ? "icon-red" : "icon-green"
              }`}
            >
              {message.includes("failed") ? (
                <ErrorIcon className="icon" />
              ) : (
                <SuccessIcon className="icon" />
              )}
            </div>
            <p className="stats-text">{message}</p>
          </div>
        )}
        <form onSubmit={handleRegister}>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
