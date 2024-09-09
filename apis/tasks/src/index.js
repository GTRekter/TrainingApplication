require('dotenv').config(); // Load environment variables

var express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

var app = express();
var port = process.env.port || 80;

// Enable CORS for all routes
app.use(cors()); 

// Middleware
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];
let nextId = 1; // Simple counter for task IDs

// Health check endpoint
app.get("/health", function (req, res) {
    res.json({ Status: "healthy" });
});

// Liveness probe endpoint
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Readiness probe endpoint
app.get('/readyz', (req, res) => {
    res.status(200).send('OK');
});

// Create a new task
app.post("/", (req, res) => {
    const { name, email } = req.body;
    const newTask = { id: nextId++, name, email };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all tasks
app.get("/", (req, res) => {
    res.json(tasks);
});

// Get a task by ID
app.get("/:id", (req, res) => {
    const { id } = req.params;
    const task = tasks.find(u => u.id == id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});

// Update a task by ID
app.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const taskIndex = tasks.findIndex(u => u.id == id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks[taskIndex] = { id: parseInt(id), name, email };
    res.json(tasks[taskIndex]);
});

// Delete a task by ID
app.delete("/:id", (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(u => u.id == id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
  const datetime = new Date();
  const message = `Server running on Port: ${port}. Started at: ${datetime}`;
  console.log(message);
});
