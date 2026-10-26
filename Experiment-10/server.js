const express = require("express");
const os = require("os");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.status(200).json({
    experiment: "Experiment 10 - Cloud Deployment",
    student: "Vansh Chaudhary | B.Tech CSE (Data Science), 2nd Year",
    university: "JSS University, Noida",
    platform: process.env.DYNO ? "Heroku Container Cloud" : "AWS Elastic Beanstalk",
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "HEALTHY", region: "ap-south-1 (Mumbai)" });
});

app.listen(PORT, () => console.log(`Dynamic cloud server listening on port ${PORT}`));