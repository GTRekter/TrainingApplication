require('dotenv').config(); 

var express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

var app = express();
var port = process.env.port || 80;

// Enable CORS for all routes
app.use(cors()); 

// Middleware
app.use(bodyParser.json());

// In-memory storage for projects
let projects = [
    {
        id: 1,
        name: "Mock Project",
        description: "This is a mock project for demonstration purposes"
    }
];
let nextProjectId = 2;

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

// Create a new project
app.post("/", (req, res) => {
    const { name, description } = req.body;
    const newProject = { id: nextProjectId++, name, description };
    projects.push(newProject);
    res.status(201).json(newProject);
});

// Get all projects
app.get("/", (req, res) => {
    res.json(projects);
});

// Get a project by ID
app.get("/:id", (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
});

// Update a project by ID
app.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const projectIndex = projects.findIndex(p => p.id == id);
    if (projectIndex === -1) {
        return res.status(404).json({ error: "Project not found" });
    }
    projects[projectIndex] = { id: parseInt(id), name, description };
    res.json(projects[projectIndex]);
});

// Create a new task for a project
app.post("/:id/tasks", (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    fetch(`${process.env.TASKS_API_URL}/projects/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, id})
    })
        .then(response => response.json())
        .then(data => res.status(201).json(data))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Get all tasks related to this project
app.get("/:id/tasks", (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }
    fetch(`${process.env.TASKS_API_URL}/projects/${id}`)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Delete a project by ID
app.delete("/:id", (req, res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(p => p.id == id);
    if (projectIndex === -1) {
        return res.status(404).json({ error: "Project not found" });
    }
    projects.splice(projectIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    const datetime = new Date();
    const message = `Server running on Port: ${port}. Started at: ${datetime}`;
    console.log(message);
});
