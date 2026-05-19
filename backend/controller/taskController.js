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
        