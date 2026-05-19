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


        