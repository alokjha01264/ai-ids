import React, { useState } from "react";
import { Steps, Button, Card, Typography, Layout } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import CaptureStep from "./CaptureStep";
import TrainStep from "./TrainStep";
import DetectStep from "./DetectStep";
import AlertsStep from "./AlertsStep";

const { Step } = Steps;
const { Title, Paragraph } = Typography;
const { Content } = Layout;

const steps = [
  {
    title: "Capture Traffic",
    description: "Record normal network activity.",
    content: <CaptureStep />,
  },
  {
    title: "Train Model",
    description: "Create and train your detection model.",
    content: <TrainStep />,
  },
  {
    title: "Run Detection",
    description: "Analyze live traffic and detect anomalies.",
    content: <DetectStep />,
  },
  {
    title: "View Alerts",
    description: "See flagged anomalies and issues.",
    content: <AlertsStep />,
  },
];

const Wizard = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          <Steps current={current} responsive labelPlacement="vertical">
            {steps.map((item) => (
              <Step
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </Steps>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: 12 }}>
              {steps[current].title}
            </Title>
            <Paragraph style={{ color: "#666", fontSize: 16 }}>
              {steps[current].description}
            </Paragraph>

            <div style={{ marginTop: 30 }}>
              {React.cloneElement(steps[current].content, { next, prev })}
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Button
              size="large"
              onClick={prev}
              disabled={current === 0}
              icon={<LeftOutlined />}
            >
              Previous
            </Button>

            {current < steps.length - 1 ? (
              <Button
                type="primary"
                size="large"
                onClick={next}
                icon={<RightOutlined />}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={
                  <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 8 }} />
                }
                disabled
              >
                Completed
              </Button>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Wizard;
