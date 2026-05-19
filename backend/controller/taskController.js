const db = require("../config/db");

exports.getTodoList = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tasks");
        res.json(rows);
    }
    catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addTask = async (req, res) => {
    const { title,status } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    if (!status) {
        status = "pending";
    }

    try {
        const [result] = await db.query("INSERT INTO tasks (title, status) VALUES (?, ?)", [title, status]);
        res.status(201).json({ id: result.insertId, title, status });
    }
    catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    try {
        const [result] = await db.query("UPDATE tasks SET title = ?, status = ? WHERE id = ?", [title, status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });
    }
    catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};