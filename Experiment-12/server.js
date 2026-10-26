const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://vansh:cluster0.mongodb.net/mern_ds_tracker");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dataset: { type: String, required: true },
  accuracy: { type: String, required: true },
  status: { type: String, default: "Deployed" }
});
const Project = mongoose.model("Project", ProjectSchema);

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ _id: -1 });
  res.status(200).json({ success: true, data: projects });
});

app.post("/api/projects", async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

app.delete("/api/projects/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Project deleted" });
});

// Serve React production build in cloud deployment (AWS / Heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MERN Cloud Server running on port ${PORT}`));