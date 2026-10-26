const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let books = [
  { id: 1, title: "Python for Data Analysis", author: "Wes McKinney", isbn: "978-1098104030", category: "Data Science" },
  { id: 2, title: "Hands-On Machine Learning", author: "Aurelien Geron", isbn: "978-1098125974", category: "AI & ML" },
  { id: 3, title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "978-1593279509", category: "Web Dev" }
];

// GET all books
app.get("/api/books", (req, res) => {
  res.status(200).json({ success: true, count: books.length, data: books });
});

// GET single book by ID
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  res.status(200).json({ success: true, data: book });
});

// POST create a new book
app.post("/api/books", (req, res) => {
  const { title, author, isbn, category } = req.body;
  if (!title || !author) return res.status(400).json({ success: false, message: "Title and author required" });
  const newBook = { id: books.length ? books[books.length - 1].id + 1 : 1, title, author, isbn, category };
  books.push(newBook);
  res.status(201).json({ success: true, message: "Book added", data: newBook });
});

// PUT update existing book
app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  Object.assign(book, req.body);
  res.status(200).json({ success: true, message: "Book updated", data: book });
});

// DELETE remove a book
app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Book not found" });
  const deleted = books.splice(index, 1);
  res.status(200).json({ success: true, message: "Book deleted", data: deleted[0] });
});

app.listen(PORT, () => console.log(`Book CRUD API running on http://localhost:${PORT}`));