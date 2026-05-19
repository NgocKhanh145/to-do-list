const express = require("express");
const router = express.Router();

const taskController = require("../controller/taskController");

router.get("/tasks", taskController.getTodoList);
router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;