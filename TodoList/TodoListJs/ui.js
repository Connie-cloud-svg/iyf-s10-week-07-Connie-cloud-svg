import { appState} from "./state.js";

const taskList = document.getElementById("task-list");
const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statCompleted = document.getElementById("stat-completed");

function stats() {
    const total = appState.tasks.length;
    const completed = appState.tasks.filter(t => t.completed).length;
    const active = total - completed;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;
}

export function filterTasks() {
    let visible = appState.tasks;
    if (appState.currentFilter === "active") visible = appState.tasks.filter(t => !t.completed);
    if (appState.currentFilter === "completed") visible = appState.tasks.filter(t => t.completed);
    return visible;
}

function clearList() {
    taskList.innerHTML = "";

    const visible = filterTasks();
    if (visible.length === 0) {
        const msg = document.createElement("p");
        msg.className = "empty-msg";
        msg.textContent = appState.tasks.length === 0
        ? 'No tasks yet. Add one above!'
        : 'No tasks in this category.';
        taskList.appendChild(msg);
        return;
    }
} 

export function render( toggleTask, deleteTask) {
    const visible = filterTasks();
    stats();

    clearList();
    visible.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item" + (task.completed ? " completed" : "" );

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'task-checkbox';
        cb.checked = task.completed;
        cb.addEventListener('change', () => toggleTask(task.id));
 
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
 
        const del = document.createElement('button');
        del.className = 'btn-delete';
        del.innerHTML = '&times;';
        del.title = 'Delete task';
        del.addEventListener('click', () => deleteTask(task.id));
 
        item.appendChild(cb);
        item.appendChild(span);
        item.appendChild(del);
        taskList.appendChild(item);

    })
}
render();

