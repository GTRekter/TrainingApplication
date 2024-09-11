// Load environment variables
require('dotenv').config();

var express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

var app = express();
var port = process.env.PORT || 80;

// Enable CORS for all routes
app.use(cors()); 

// Middleware
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [
    {
        id: 1,
        name: "Mock Task",
        description: "This is a mock task for demonstration purposes",
        projectId: 1,
        status: "open"
    }
];
let nextId = 2; 

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
    const { name, description, id } = req.body;
    const newTask = { id: nextId++, name, description, projectId: id, status: "open" };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all tasks
app.get("/", (req, res) => {
    res.json(tasks);
});

// Get all tasks by project ID
app.get("/projects/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Project ID is required" });
    }
    const projectTasks = tasks.filter(u => u.projectId == id);
    res.json(projectTasks);
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

// Get all tasks related to a project
app.get("/projects/:id", (req, res) => {
    const { id } = req.params; 
    const projectTasks = tasks.filter(task => task.projectId == id);
    if (projectTasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for this project" });
    }
    res.json(projectTasks);
});

// Update a task by ID 
app.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const taskIndex = tasks.findIndex(u => u.id == id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks[taskIndex] = { id: parseInt(id), name, description, status };
    res.json(tasks[taskIndex]);
});

// Update a task status by ID and mark project as completed if all tasks are completed, and mark it as open if any task is open
app.put("/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const taskIndex = tasks.findIndex(u => u.id == id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks[taskIndex].status = status;

    const projectTasks = tasks.filter(t => t.projectId == tasks[taskIndex].projectId);
    const allCompleted = projectTasks.every(t => t.status === "completed");
    if (allCompleted) {
        fetch(`${process.env.PROJECTS_API_URL}/${tasks[taskIndex].projectId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" })
        }).then(response => response.json())
          .then(() => console.log(`Project ${tasks[taskIndex].projectId} marked as completed.`))
          .catch(err => console.error(err));
    } else {
        fetch(`${process.env.PROJECTS_API_URL}/${tasks[taskIndex].projectId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "open" })
        }).then(response => response.json())
          .then(() => console.log(`Project ${tasks[taskIndex].projectId} marked as open.`))
          .catch(err => console.error(err));
    }
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
}).on('error', (err) => {
    console.error('Server error:', err);
});