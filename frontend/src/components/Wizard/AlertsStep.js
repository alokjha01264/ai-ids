import React, { useEffect, useState } from "react";
import axios from "axios";

const AlertsStep = ({ prev }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("/my_alerts_json").then(res => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h3>Your Alerts</h3>
      <button onClick={prev}>Back</button>
      <table border="1" cellPadding="5" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source IP</th>
            <th>Destination IP</th>
            <th>Alert Type</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => (
            <tr key={i}>
              <td>{a.timestamp}</td>
              <td>{a.source_ip}</td>
              <td>{a.destination_ip}</td>
              <td>{a.alert_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsStep;
