const express = require("express");
const router = express.Router();

const taskController = require("../controller/taskController");

router.get("/tasks", taskController.getTodoList);

module.exports = router;