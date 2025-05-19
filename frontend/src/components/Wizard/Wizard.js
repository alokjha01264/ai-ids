import React, { useState } from "react";
import { Steps, Button, message } from "antd";
import CaptureStep from "./CaptureStep";
import TrainStep from "./TrainStep";
import DetectStep from "./DetectStep";
import AlertsStep from "./AlertsStep";

const { Step } = Steps;

const steps = [
  {
    title: "Capture Normal Traffic",
    content: <CaptureStep />,
  },
  {
    title: "Train Model",
    content: <TrainStep />,
  },
  {
    title: "Run Detection",
    content: <DetectStep />,
  },
  {
    title: "View Alerts",
    content: <AlertsStep />,
  },
];

const Wizard = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ margin: "40px 0" }}>{React.cloneElement(steps[current].content, { next, prev })}</div>
      <div>
        {current > 0 && <Button onClick={prev} style={{ marginRight: 8 }}>Previous</Button>}
        {current < steps.length - 1 && <Button type="primary" onClick={next}>Next</Button>}
      </div>
    </div>
  );
};

export default Wizard;
