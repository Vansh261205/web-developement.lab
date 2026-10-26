import React, { useState, useEffect } from "react";

export default function MernCloudApp() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [dataset, setDataset] = useState("");
  const [accuracy, setAccuracy] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((json) => setProjects(json.data || []));
  }, []);

  const addProject = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dataset, accuracy, status: "Deployed on AWS" })
    });
    const json = await res.json();
    setProjects([json.data, ...projects]);
    setTitle(""); setDataset(""); setAccuracy("");
  };

  return (
    <div className="mern-dashboard">
      <h1>MERN Stack Data Science Project Tracker (Cloud Deployed)</h1>
      <form onSubmit={addProject}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Model Name" required />
        <input value={dataset} onChange={(e) => setDataset(e.target.value)} placeholder="Dataset" required />
        <input value={accuracy} onChange={(e) => setAccuracy(e.target.value)} placeholder="Accuracy (%)" required />
        <button type="submit">Deploy Model Record</button>
      </form>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>{p.title} — {p.dataset} ({p.accuracy}) [{p.status}]</li>
        ))}
      </ul>
    </div>
  );
}