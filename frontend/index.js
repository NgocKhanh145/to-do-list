const API_URL = "http://localhost:3000/api";
let isEditMode = false;
let editingTaskId = null;

// DOM Elements
const titleInput = document.getElementById("titleInput");
const statusSelect = document.getElementById("statusSelect");
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("tbody");

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    addBtn.addEventListener("click", handleAddTask);
    loadTasks();
});

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Lỗi khi tải công việc</td></tr>';
    }
}

// Render tasks to table
function renderTasks(tasks) {
    if (tasks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Chưa có công việc nào</td></tr>';
        return;
    }

    tableBody.innerHTML = tasks
        .map((task, index) => {
            const statusText = getStatusText(task.status);
            const createdDate = task.created_at ? new Date(task.created_at).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN");

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${task.title}</td>
                    <td class="status"><span class="status-badge">${statusText}</span></td>
                    <td>${createdDate}</td>
                    <td>
                        <div class="actions">
                            <button onclick="handleEditTask(${task.id}, '${task.title.replace(/'/g, "\\'")}', '${task.status}')">Chỉnh sửa</button>
                            <button class="delete" onclick="handleDeleteTask(${task.id})">Xóa</button>
                        </div>
                    </td>
                </tr>
            `;
        })
        .join("");
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        Pending: "Pending",
        "In-Progress": "In Progress",
        Done: "Done",
    };
    return statusMap[status] || status;
}

// Handle add task
async function handleAddTask() {
    const title = titleInput.value.trim();
    const status = statusSelect.value;

    if (!title) {
        alert("Vui lòng nhập tên công việc");
        return;
    }

    if (isEditMode) {
        await updateTask(editingTaskId, title, status);
    } else {
        await addTask(title, status);
    }
}

// Add task to API
async function addTask(title, status) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, status }),
        });

        if (!response.ok) throw new Error("Failed to add task");

        titleInput.value = "";
        statusSelect.value = "Pending";
        loadTasks();
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Lỗi khi thêm công việc");
    }
}

// Handle edit task
function handleEditTask(id, title, status) {
    isEditMode = true;
    editingTaskId = id;
    titleInput.value = title;
    statusSelect.value = status;
    addBtn.textContent = "Cập nhật công việc";
    titleInput.focus();
}

// Update task to API
async function updateTask(id, title, status) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, status }),
        });

        if (!response.ok) throw new Error("Failed to update task");

        // Reset form
        isEditMode = false;
        editingTaskId = null;
        titleInput.value = "";
        statusSelect.value = "Pending";
        addBtn.textContent = "Thêm công việc";
        loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Lỗi khi cập nhật công việc");
    }
}

// Handle delete task
async function handleDeleteTask(id) {
    if (confirm("Bạn chắc chắn muốn xóa công việc này?")) {
        await deleteTask(id);
    }
}

// Delete task from API
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete task");

        loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Lỗi khi xóa công việc");
    }
}
