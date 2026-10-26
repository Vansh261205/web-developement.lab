import React, { useState, useEffect } from "react";

export default function NotesApp() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Exploratory Data Analysis", category: "Data Science", content: "Clean missing values in Pandas and plot correlation heatmap." },
    { id: 2, title: "React Hooks Revision", category: "Web Lab", content: "Review useState and useEffect lifecycle methods for SPA state." },
    { id: 3, title: "SQL Indexing Notes", category: "DBMS", content: "Compare B-Tree and Hash indexing query execution plans." }
  ]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Data Science");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (editId !== null) {
      setNotes(notes.map((n) => (n.id === editId ? { ...n, title, category, content } : n)));
      setEditId(null);
    } else {
      setNotes([{ id: Date.now(), title, category, content }, ...notes]);
    }
    setTitle("");
    setContent("");
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>React.js Study Notes SPA</h1>
        <p>Student: Vansh Chaudhary | B.Tech CSE (Data Science), 2nd Year</p>
      </header>
      <form className="note-form" onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note Title" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Data Science">Data Science</option>
          <option value="Web Lab">Web Lab</option>
          <option value="DBMS">DBMS</option>
        </select>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write note details..." required />
        <button type="submit">{editId ? "Update Note" : "Add Note"}</button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <span className="badge">{note.category}</span>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="actions">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}