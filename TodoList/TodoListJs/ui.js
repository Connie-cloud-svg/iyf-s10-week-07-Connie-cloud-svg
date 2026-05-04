import { appState } from "./state.js";

/** @type {HTMLElement | null} */
const taskList = document.getElementById("task-list");
/** @type {HTMLElement | null} */
const statTotal = document.getElementById("stat-total");
/** @type {HTMLElement | null} */
const statActive = document.getElementById("stat-active");
/** @type {HTMLElement | null} */
const statCompleted = document.getElementById("stat-completed");

if (!taskList || !statTotal || !statActive || !statCompleted) {
	throw new Error(
		"Missing required DOM elements (task-list / stat-total / stat-active / stat-completed)"
	);
}


/** @type {HTMLElement} */
const taskListEl = taskList;
/** @type {HTMLElement} */
const statTotalEl = statTotal;
/** @type {HTMLElement} */
const statActiveEl = statActive;
/** @type {HTMLElement} */
const statCompletedEl = statCompleted;

function stats() {
    const total = appState.tasks.length;
    const completed = appState.tasks.filter(t => t.completed).length;
    const active = total - completed;

	// ...
	statTotalEl.textContent = String(total);
	statActiveEl.textContent = String(active);
	statCompletedEl.textContent = String(completed);
}

export function filterTasks() {
	let visible = appState.tasks;
	if (appState.currentFilter === "active") visible = appState.tasks.filter(t => !t.completed);
	if (appState.currentFilter === "completed") visible = appState.tasks.filter(t => t.completed);
	return visible;
}

function clearList() {
	taskListEl.innerHTML = "";
}

function showEmptyMessage() {
	const msg = document.createElement("p");
	msg.className = "empty-msg";
	msg.textContent =
		appState.tasks.length === 0
			? "No tasks yet. Add one above!"
			: "No tasks in this category.";
	    taskListEl.appendChild(msg);
}

/**
 * @param {(id: number) => void} toggleTask
 * @param {(id: number) => void} deleteTask
 */
export function render(toggleTask, deleteTask) {
	const visible = filterTasks();
	stats();
	clearList();

	if (visible.length === 0) {
		showEmptyMessage();
		return;
	}

	visible.forEach(task => {
		const item = document.createElement("div");
		item.className = "task-item" + (task.completed ? " completed" : "");

		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.className = "task-checkbox";
		cb.checked = task.completed;
		cb.addEventListener("change", () => toggleTask(task.id));

		const span = document.createElement("span");
		span.className = "task-text";
		span.textContent = task.text;

		const del = document.createElement("button");
		del.className = "btn-delete";
		del.innerHTML = "&times;";
		del.title = "Delete task";
		del.addEventListener("click", () => deleteTask(task.id));

		item.appendChild(cb);
		item.appendChild(span);
		item.appendChild(del);
		// @ts-ignore
		taskList.appendChild(item);
	});
}