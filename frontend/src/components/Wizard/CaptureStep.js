import React, { useState } from "react";
import axios from "axios";

const CaptureStep = ({ next }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleCapture = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/collect_normal");
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      setResult("Error capturing traffic.");
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Click the button to capture your normal network traffic (100 packets or 30 seconds).</p>
      <button onClick={handleCapture} disabled={loading}>
        {loading ? "Capturing..." : "Capture Normal Traffic"}
      </button>
      <div style={{ marginTop: 16 }}>{result}</div>
      {result && <button onClick={next}>Continue</button>}
    </div>
  );
};

export default CaptureStep;
