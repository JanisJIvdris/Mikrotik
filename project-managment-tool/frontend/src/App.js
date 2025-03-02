import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import TemplatesPage from "./pages/TemplatesPage";
import RequireAuth from "./components/RequireAuth";
import "./styles.css";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />+{" "}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/templates"
            element={
              <RequireAuth>
                <TemplatesPage />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
