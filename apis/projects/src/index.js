require('dotenv').config(); 

var express = require('express');
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require('cors');

var app = express();
var port = process.env.port || 1337;

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
const pool = mysql.createPool(dbConfig);

// Enable CORS for all routes
app.use(cors()); 

// Middleware
app.use(bodyParser.json());

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
    pool.query('SELECT 1')
      .then(() => res.status(200).send('OK'))
      .catch(() => res.status(500).send('Not OK'));
});

// Create a new project
app.post("/projects", async (req, res) => {
    const { name, description } = req.body;
    try {
        const [result] = await pool.execute(
            "INSERT INTO projects (name, description) VALUES (?, ?)",
            [name, description]
        );
        res.status(201).json({ id: result.insertId, name, description });
    } catch (err) {
        console.error("Error creating project", err.stack);
        res.status(500).json({ error: "Failed to create project" });
    }
});

// Get all projects
app.get("/projects", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM projects");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching projects", err.stack);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// Get a project by ID
app.get("/projects/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute("SELECT * FROM projects WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching project", err.stack);
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

// Update a project by ID
app.put("/projects/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const [result] = await pool.execute("UPDATE projects SET name = ?, description = ? WHERE id = ?", [name, description, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json({ id, name, description });
    } catch (err) {
        console.error("Error updating project", err.stack);
        res.status(500).json({ error: "Failed to update project" });
    }
});

// Delete a project by ID
app.delete("/projects/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute("DELETE FROM projects WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting project", err.stack);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

app.listen(port, () => {
  const datetime = new Date();
  const message = `Server running on Port: ${port}. Started at: ${datetime}`;
  console.log(message);
});
