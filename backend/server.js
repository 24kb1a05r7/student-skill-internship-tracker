require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

app.get("/", (req, res) => {
    res.send("Student Skill & Internship Tracker API is running!");
});

app.get("/api/skills", (req, res) => {
    db.query("SELECT * FROM skills", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/api/skills", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Skill name is required" });
    }

    db.query(
        "INSERT INTO skills (name) VALUES (?)",
        [name],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, name });
        }
    );
});

app.get("/api/internships", (req, res) => {
    db.query("SELECT * FROM internships", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/api/internships", (req, res) => {
    const { company, role } = req.body;

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required"
        });
    }

    db.query(
        "INSERT INTO internships (company, role) VALUES (?, ?)",
        [company, role],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: result.insertId,
                company,
                role
            });
        }
    );
});

app.get("/api/applications", (req, res) => {
    const sql = `
        SELECT applications.id, applications.status,
               internships.company, internships.role
        FROM applications
        JOIN internships ON applications.internship_id = internships.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/api/applications", (req, res) => {
    const { internship_id } = req.body;

    if (!internship_id) {
        return res.status(400).json({
            error: "Internship ID is required"
        });
    }

    db.query(
        "INSERT INTO applications (internship_id) VALUES (?)",
        [internship_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: result.insertId,
                internship_id,
                status: "Applied"
            });
        }
    );
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});