import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">Project Management Tool</h1>
        <div className="navbar-right">
          {!token ? (
            <ul className="navbar-links">
              <li>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="navbar-link">
                  Register
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-links">
              <li>
                <Link to="/" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/templates" className="navbar-link">
                  Templates
                </Link>
              </li>
              <li className="navbar-user">
                <span className="navbar-username">
                  {username || "Unknown User"}
                </span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
