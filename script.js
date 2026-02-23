let data = JSON.parse(localStorage.getItem("tasks")) || {
    todo: [],
    inprogress: [],
    done: []
};

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(data));
}

function render() {
    document.querySelectorAll(".column").forEach(column => {
        const colName = column.dataset.column;
        const taskList = column.querySelector(".task-list");
        taskList.innerHTML = "";

        data[colName].forEach((taskText, index) => {
            const task = document.createElement("div");
            task.className = "task";
            task.draggable = true;
            task.innerHTML = `
                <span>${taskText}</span>
                <button onclick="deleteTask('${colName}', ${index})">X</button>
            `;

            task.addEventListener("dragstart", () => {
                task.classList.add("dragging");
                task.dataset.index = index;
                task.dataset.column = colName;
            });

            task.addEventListener("dragend", () => {
                task.classList.remove("dragging");
            });

            taskList.appendChild(task);
        });
    });
}

function addTask(column) {
    const input = document.getElementById(column + "-input");
    if (input.value.trim() === "") return;

    data[column].push(input.value.trim());
    input.value = "";
    saveData();
    render();
}

function deleteTask(column, index) {
    data[column].splice(index, 1);
    saveData();
    render();
}

document.querySelectorAll(".column").forEach(column => {
    column.addEventListener("dragover", e => {
        e.preventDefault();
        column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("drag-over");
    });

    column.addEventListener("drop", e => {
        column.classList.remove("drag-over");

        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const fromColumn = dragging.dataset.column;
        const index = dragging.dataset.index;
        const toColumn = column.dataset.column;

        const movedTask = data[fromColumn][index];
        data[fromColumn].splice(index, 1);
        data[toColumn].push(movedTask);

        saveData();
        render();
    });
});

render();