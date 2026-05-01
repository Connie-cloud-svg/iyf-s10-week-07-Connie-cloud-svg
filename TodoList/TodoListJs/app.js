import { appState } from './state.js';
import { render } from './ui.js';
import { getNextId } from './utils.js';
import { saveTasks, loadTasks } from './storage.js';

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');;
const filterBtns = document.querySelectorAll('.filter-btn');

function addTask() {
    const text = input.value.trim();
    if (!text) return;

    appState.tasks.push({id: getNextId(appState.tasks), text, completed: false});
    input.value = '';
    saveTasks();
    render(toggleTask, deleteTask);
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

function toggleTask(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks();
    render(toggleTask, deleteTask);
}

function deleteTask(id) {
    appState.tasks = appState.tasks.filter(t => t.id !== id);
    saveTasks();
    render(toggleTask, deleteTask);
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.currentFilter = btn.dataset.filter;
        localStorage.setItem('filter', appState.currentFilter);
        render(toggleTask, deleteTask);
    })
})

const savedFilter = localStorage.getItem('filter');
if (savedFilter) {
    appState.currentFilter = savedFilter;
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === savedFilter);
    });
}

loadTasks();
render(toggleTask, deleteTask);
