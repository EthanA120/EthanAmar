const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("tasksList");

let tasks = [
    { id: crypto.randomUUID(), task: "Do homework" },
    { id: crypto.randomUUID(), task: "Buy milk" }
];

function saveTasksInLocalStorage() {
    localStorage.setItem("storedTasks", JSON.stringify(tasks));
}

function restoreTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("storedTasks");
    tasks = JSON.parse(storedTasks) || tasks;
    printTasks();
}

function printTasks() {
    tasks.forEach(task => {
        const taskListItem = document.createElement("li");
        const taskParagraph = document.createElement("p");
        const taskButtonsContainer = document.createElement("div");

        taskParagraph.innerText = task.task;
        taskButtonsContainer.className = "buttons-container";

        const editTaskButton = editTask(task, taskParagraph);
        const removeTaskButton = deleteTask(task, taskListItem);

        taskButtonsContainer.appendChild(editTaskButton);
        taskButtonsContainer.appendChild(removeTaskButton);
        taskListItem.appendChild(taskParagraph);
        taskListItem.appendChild(taskButtonsContainer);
        taskList.appendChild(taskListItem);
    })
}

function addTask(taskToAdd) {
    if (taskToAdd.trim() === "") return; // Prevent blank note
    tasks.push({ id: crypto.randomUUID(), task: taskToAdd });
    taskInput.value = "";
    taskList.replaceChildren();
    saveTasksInLocalStorage();
    printTasks();
}

function editTask(task, taskParagraph) {
    const editTaskButton = document.createElement("button");
    editTaskButton.innerText = "edit";
    editTaskButton.className = "edit-btn material-symbols-outlined";
    editTaskButton.title = "ערוך משימה";

    editTaskButton.addEventListener("click", () => {
        if (editTaskButton.innerText === "edit") {
            editTaskButton.innerText = "check";
            editTaskButton.title = "סיום";
            editTaskButton.style.backgroundColor = "#2196F3"
            taskParagraph.contentEditable = true;
            taskParagraph.focus();
        } else {
            editTaskButton.innerText = "edit";
            editTaskButton.title = "ערוך משימה";
            editTaskButton.style.backgroundColor = ""; // Back to original BG Color
            taskParagraph.contentEditable = false;
            task.task = taskParagraph.innerText;
            saveTasksInLocalStorage();
        }
    })
    return editTaskButton;
}

function deleteTask(task, taskListItem) {
    const removeTaskButton = document.createElement("button");
    removeTaskButton.innerText = "delete";
    removeTaskButton.className = "delete-btn material-symbols-outlined";
    removeTaskButton.title = "מחק משימה";

    removeTaskButton.addEventListener("click", () => {
        taskListItem.remove();
        tasks = tasks.filter(taskInTasks => taskInTasks.id !== task.id);
        saveTasksInLocalStorage();
    })
    return removeTaskButton;
}

addButton.addEventListener("click", () => addTask(taskInput.value));

restoreTasksFromLocalStorage();
