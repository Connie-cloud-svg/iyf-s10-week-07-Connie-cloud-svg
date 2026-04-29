import { appState } from "./state.js";
import { getNextId } from "./utils.js";

const STORAGE_PREFIX = "todolist_";
const TASKS_KEY = STORAGE_PREFIX + "tasks";

export function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(appState.tasks));
}

export function loadTasks() {
    const data = localStorage.getItem(TASKS_KEY);
    if (data) {
        appState.tasks = JSON.parse(data);
        appState.nextId = getNextId(appState.tasks);
    }
}

