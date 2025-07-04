import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "/signup",
        { email, password },
        { withCredentials: true }
      );
      navigate("/wizard");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Email address already exists.");
      } else {
        setError("Signup failed.");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create an Account</h2>
        <p style={styles.subheading}>Join now to get started</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <a href="/login">Log in</a>
        </p>

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: "40px 30px",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 24,
  },
  subheading: {
    marginBottom: 24,
    color: "#777",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: "10px 12px",
    background: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "500",
  },
  link: {
    marginTop: 20,
    fontSize: 13,
    color: "#555",
  },
  error: {
    marginTop: 16,
    color: "red",
    fontSize: 14,
  },
};
