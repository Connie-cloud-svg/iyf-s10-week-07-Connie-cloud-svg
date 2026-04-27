    // ── State ──────────────────────────────────────────────────────────
    let tasks = [];
    let currentFilter = 'all';
    let nextId = 1;
 
    // ── DOM refs ───────────────────────────────────────────────────────
    const input      = document.getElementById('task-input');
    const addBtn     = document.getElementById('add-btn');
    const taskList   = document.getElementById('task-list');
    const emptyMsg   = document.getElementById('empty-msg');
    const clearBtn   = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const statTotal  = document.getElementById('stat-total');
    const statActive = document.getElementById('stat-active');
    const statDone   = document.getElementById('stat-completed');
 
    // ── Add task ───────────────────────────────────────────────────────
    function addTask() {
      const text = input.value.trim();
      if (!text) return;
 
      tasks.push({ id: nextId++, text, completed: false });
      input.value = '';
      saveTasks();
      render();
    }
 
    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
 
    // ── Toggle complete ────────────────────────────────────────────────
    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) task.completed = !task.completed;
      saveTasks();
      render();
    }
 
    // ── Delete task ────────────────────────────────────────────────────
    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }
 
    // ── Clear completed ────────────────────────────────────────────────
    clearBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
    });
 
    // ── Filter ─────────────────────────────────────────────────────────
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });
    localStorage.setItem('filter', currentFilter);
 
    // ── Render ─────────────────────────────────────────────────────────
    function render() {
      // Stats
      const total     = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const active    = total - completed;
 
      statTotal.textContent = total;
      statActive.textContent = active;
      statDone.textContent  = completed;
 
      // Filter tasks
      let visible = tasks;
      if (currentFilter === 'active')    visible = tasks.filter(t => !t.completed);
      if (currentFilter === 'completed') visible = tasks.filter(t => t.completed);
 
      // Clear list (keep empty msg)
      taskList.innerHTML = '';
 
      if (visible.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.textContent = tasks.length === 0
          ? 'No tasks yet. Add one above!'
          : 'No tasks in this category.';
        taskList.appendChild(msg);
        return;
      }
 
      visible.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item' + (task.completed ? ' completed' : '');
 
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
      });
    }
 
    // Initial rend
    render();

    // ── LocalStorage ───────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
    nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }
}
loadTasks();
render();

const savedFilter = localStorage.getItem('filter');
  if (savedFilter) {
    currentFilter = savedFilter;
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === currentFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }