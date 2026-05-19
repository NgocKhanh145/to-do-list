const express = require("express");
const router = express.Router();

const taskController = require("../controller/taskController");

router.get("/tasks", taskController.getTodoList);
router.delete("/tasks/:id", taskController.deleteTask);
router.post("/tasks", taskController.addTask);
module.exports = router;