import React, { useState } from "react";
import axios from "axios";

const DetectStep = ({ next, prev }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleDetect = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/run_detection");
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      setResult("Error running detection.");
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Run real-time detection to find anomalies in your current traffic.</p>
      <button onClick={handleDetect} disabled={loading}>
        {loading ? "Detecting..." : "Run Detection"}
      </button>
      <div style={{ marginTop: 16 }}>{result}</div>
      <button onClick={prev}>Back</button>
      {result && <button onClick={next}>Continue</button>}
    </div>
  );
};

export default DetectStep;
