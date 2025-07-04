import React, { useState } from "react";
import axios from "axios";

const TrainStep = ({ next, prev }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleTrain = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/train_model");
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      setResult("Error training model. Not enough normal traffic data. Please run capture normal traffic atleast 20 times.");
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Now train your anomaly detection model using your captured normal traffic.</p>
      <button onClick={handleTrain} disabled={loading}>
        {loading ? "Training..." : "Train Model"}
      </button>
      <div style={{ marginTop: 16 }}>{result}</div>
      <button onClick={prev}>Back</button>
      {result && <button onClick={next}>Continue</button>}
    </div>
  );
};

export default TrainStep;
