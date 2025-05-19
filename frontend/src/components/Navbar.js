import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("/logout", { withCredentials: true });
    navigate("/login");
  };

  return (
    <header style={{
      width: "100%",
      padding: "10px 20px",
      background: "#222",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <Link to="/wizard" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          IDS Dashboard
        </Link>
      </div>
      <nav>
        <Link to="/wizard" style={{ color: "#fff", marginRight: 20 }}>Wizard</Link>
        <Link to="/my_alerts" style={{ color: "#fff", marginRight: 20 }}>Alerts</Link>
        <button onClick={handleLogout} style={{
          background: "#fff",
          color: "#222",
          border: "none",
          padding: "6px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Logout
        </button>
      </nav>
    </header>
  );
}
