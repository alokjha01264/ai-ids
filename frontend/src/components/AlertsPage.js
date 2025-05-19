import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    axios
      .get("/my_alerts_json")
      .then((res) => {
        if (mounted) {
          setAlerts(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Failed to load alerts.");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleDownload = () => {
    window.location.href = "/export_alerts_csv";
  };

  if (loading) return <div style={{ padding: 20 }}>Loading alerts...</div>;
  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2>My Alerts</h2>
      <button onClick={handleDownload} style={{
        marginBottom: 20,
        padding: "6px 16px",
        borderRadius: "4px",
        border: "1px solid #222",
        background: "#fff",
        cursor: "pointer"
      }}>
        Download as CSV
      </button>
      {alerts.length === 0 ? (
        <div>No alerts found.</div>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>Timestamp</th>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Source Port</th>
              <th>Destination Port</th>
              <th>Packet Size</th>
              <th>TCP Flags</th>
              <th>Alert Type</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i}>
                <td>{a.timestamp}</td>
                <td>{a.source_ip}</td>
                <td>{a.destination_ip}</td>
                <td>{a.source_port}</td>
                <td>{a.destination_port}</td>
                <td>{a.packet_size}</td>
                <td>{a.tcp_flags}</td>
                <td>{a.alert_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
