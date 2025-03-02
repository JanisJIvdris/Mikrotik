import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../components/Dashboard.css";

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
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {message.includes("failed") ? (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </>
                ) : (
                  <>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </>
                )}
              </svg>
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

      <div className="card">
        <p style={{ margin: 0, textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#3498db", textDecoration: "none" }}
          >
            Login here.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
