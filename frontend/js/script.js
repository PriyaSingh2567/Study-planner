const API = '/api';
let token = localStorage.getItem('token');
let currentFilter = 'all';
let allTasks = [];
let expandedTaskId = null;

// ========== EMAIL VALIDATION ==========
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('input-error');
  error.textContent = message;
  error.classList.remove('hidden');
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('input-error');
  error.classList.add('hidden');
}

// Live email validation on blur
document.addEventListener('DOMContentLoaded', () => {
  const loginEmail = document.getElementById('login-email');
  const regEmail = document.getElementById('reg-email');
  const regName = document.getElementById('reg-name');
  const regPassword = document.getElementById('reg-password');

  loginEmail?.addEventListener('blur', () => {
    if (loginEmail.value && !isValidEmail(loginEmail.value)) {
      showFieldError('login-email', 'login-email-error', 'Please enter a valid email address');
    } else {
      clearFieldError('login-email', 'login-email-error');
    }
  });

  regEmail?.addEventListener('blur', () => {
    if (regEmail.value && !isValidEmail(regEmail.value)) {
      showFieldError('reg-email', 'reg-email-error', 'Please enter a valid email address');
    } else {
      clearFieldError('reg-email', 'reg-email-error');
    }
  });

  regName?.addEventListener('blur', () => {
    if (regName.value && regName.value.trim().length < 2) {
      showFieldError('reg-name', 'reg-name-error', 'Name must be at least 2 characters');
    } else {
      clearFieldError('reg-name', 'reg-name-error');
    }
  });

  regPassword?.addEventListener('blur', () => {
    if (regPassword.value && regPassword.value.length < 6) {
      showFieldError('reg-password', 'reg-password-error', 'Password must be at least 6 characters');
    } else {
      clearFieldError('reg-password', 'reg-password-error');
    }
  });

  // Clear errors on input
  [loginEmail, regEmail, regName, regPassword].forEach(el => {
    el?.addEventListener('input', () => {
      el.classList.remove('input-error');
      const errorEl = el.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.classList.add('hidden');
    });
  });

  // Init app
  if (token) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) { showApp(user); return; }
  }
  document.getElementById('auth-screen').classList.remove('hidden');
});

// ========== AUTH ==========
function showLogin() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  clearErrors();
}

function showRegister() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.field-error').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!isValidEmail(email)) {
    showFieldError('login-email', 'login-email-error', 'Please enter a valid email address');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    token = data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showApp(data.user);
  } catch (err) {
    const el = document.getElementById('login-error');
    el.textContent = err.message;
    el.classList.remove('hidden');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  let hasError = false;

  if (fullName.length < 2) {
    showFieldError('reg-name', 'reg-name-error', 'Name must be at least 2 characters');
    hasError = true;
  }
  if (!isValidEmail(email)) {
    showFieldError('reg-email', 'reg-email-error', 'Please enter a valid email address');
    hasError = true;
  }
  if (password.length < 6) {
    showFieldError('reg-password', 'reg-password-error', 'Password must be at least 6 characters');
    hasError = true;
  }

  if (hasError) return;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    token = data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showApp(data.user);
  } catch (err) {
    const el = document.getElementById('register-error');
    el.textContent = err.message;
    el.classList.remove('hidden');
  }
}

function handleLogout() {
  token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  clearErrors();
}

// ========== APP ==========
function showApp(user) {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  document.getElementById('user-name').textContent = user.fullName;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.fullName.charAt(0).toUpperCase();

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${greet}, ${user.fullName.split(' ')[0]}`;

  fetchTasks();
}

function showSection(section, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`section-${section}`).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

// ========== TASKS ==========
function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function fetchTasks() {
  try {
    const res = await fetch(`${API}/tasks`, { headers: authHeaders() });
    if (res.status === 401) { handleLogout(); return; }
    allTasks = await res.json();
    renderTasks(allTasks);
    updateStats(allTasks);
    updateProgress(allTasks);
    renderUpcoming(allTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
}

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  const filtered = filterTaskList(tasks, currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-state">No tasks found</p>';
    return;
  }

  const stageLabels = ['Not Started', 'Learning', 'Practicing', 'Completed'];
  const stageColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const stageDescs = ['Task has not been started yet', 'Reading and understanding the topic', 'Solving problems and practicing', 'Topic fully completed'];

  list.innerHTML = filtered.map(task => {
    const dueDate = new Date(task.deadline).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    const isOverdue = !task.completed && new Date(task.deadline) < new Date();
    const stage = task.stage || 0;
    const stagePercent = Math.round((stage / 3) * 100);
    const circumference = 2 * Math.PI * 24;
    const dashOffset = circumference - (stagePercent / 100) * circumference;
    const stageIcons = ['&#128214;', '&#9997;', '&#128736;', '&#127942;'];

    return `
      <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task._id}" onclick="toggleTaskExpand(this)">
        <div class="task-top">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
            onchange="event.stopPropagation(); toggleTask('${task._id}', ${!task.completed})" onclick="event.stopPropagation()">
          <div class="task-details">
            <div class="task-subject">${task.subject} - ${task.topic}</div>
            <div class="task-meta">Due: ${dueDate} ${isOverdue ? '(Overdue)' : ''}</div>
          </div>
          <span class="stage-badge" style="color: ${stageColors[stage]}; border-color: ${stageColors[stage]}30; background: ${stageColors[stage]}15">${stageLabels[stage]}</span>
          <span class="priority-badge priority-${task.priority || 'medium'}">${task.priority || 'medium'}</span>
          <button class="btn-delete-task" onclick="event.stopPropagation(); deleteTask('${task._id}')">Delete</button>
        </div>
        <div class="task-expand">
          <div class="stage-timeline">
            <div class="stage-ring-section">
              <svg class="stage-ring" width="100" height="100" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#1a1a30" stroke-width="4"/>
                <circle cx="28" cy="28" r="24" fill="none" stroke="${stageColors[stage]}" stroke-width="4"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
                  stroke-linecap="round" transform="rotate(-90 28 28)" style="transition: all 0.5s"/>
              </svg>
              <span class="stage-ring-text" style="color: ${stageColors[stage]}">${stagePercent}%</span>
            </div>
            <div class="stage-vertical">
              ${stageLabels.map((label, i) => {
                const stepPercent = i <= stage ? 100 : 0;
                const stepCirc = 2 * Math.PI * 14;
                const stepOffset = stepCirc - (stepPercent / 100) * stepCirc;
                return `
                <button class="stage-row ${i <= stage ? 'done' : ''} ${i === stage ? 'current' : ''}"
                  onclick="event.stopPropagation(); setStage('${task._id}', ${i})">
                  <div class="stage-line-wrap">
                    <div class="stage-circle-wrap">
                      <svg width="48" height="48" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="${i <= stage ? stageColors[i] + '20' : '#1a1a30'}" stroke="#2a2a4a" stroke-width="2"/>
                        <circle cx="18" cy="18" r="14" fill="none" stroke="${i <= stage ? stageColors[i] : 'transparent'}" stroke-width="2.5"
                          stroke-dasharray="${stepCirc}" stroke-dashoffset="${stepOffset}"
                          stroke-linecap="round" transform="rotate(-90 18 18)" style="transition: all 0.4s"/>
                      </svg>
                      <span class="stage-circle-icon ${i <= stage ? 'active' : ''}" style="${i <= stage ? 'color:' + stageColors[i] : ''}">${i <= stage ? (i === stage && stage < 3 ? stageIcons[i] : '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="' + stageColors[i] + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>') : stageIcons[i]}</span>
                    </div>
                    ${i < 3 ? '<div class="stage-connector" style="' + (i < stage ? 'background: linear-gradient(180deg,' + stageColors[i] + ',' + stageColors[i+1] + ')' : '') + '"></div>' : ''}
                  </div>
                  <div class="stage-text">
                    <span class="stage-label" style="${i <= stage ? 'color:' + stageColors[i] : ''}">${label}</span>
                    <span class="stage-desc">${stageDescs[i]}</span>
                    ${i <= stage ? '<span class="stage-complete-tag" style="color:' + stageColors[i] + '; border-color:' + stageColors[i] + '30; background:' + stageColors[i] + '15">' + (i < stage ? 'Completed' : (stage === 3 && i === 3 ? 'Completed' : 'In Progress')) + '</span>' : ''}
                  </div>
                </button>
              `}).join('')}
            </div>
          </div>
          <div class="stage-actions">
            <button class="btn-stage-done" onclick="event.stopPropagation(); closeExpand(this)">Done</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-expand previously expanded task
  if (expandedTaskId) {
    const card = document.querySelector(`.task-card[data-task-id="${expandedTaskId}"]`);
    if (card) card.classList.add('expanded');
  }
}

function filterTaskList(tasks, filter) {
  const now = new Date();
  switch (filter) {
    case 'pending': return tasks.filter(t => !t.completed);
    case 'completed': return tasks.filter(t => t.completed);
    case 'overdue': return tasks.filter(t => !t.completed && new Date(t.deadline) < now);
    default: return tasks;
  }
}

function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks(allTasks);
}

function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-overdue').textContent = overdue;
}

function updateProgress(tasks) {
  const total = tasks.length;
  if (total === 0) {
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('progress-text').textContent = '0%';
    return;
  }
  const totalStages = total * 3;
  const completedStages = tasks.reduce((sum, t) => sum + (t.stage || 0), 0);
  const percent = Math.round((completedStages / totalStages) * 100);

  document.getElementById('progress-bar').style.width = `${percent}%`;
  document.getElementById('progress-text').textContent = `${percent}%`;
}

function renderUpcoming(tasks) {
  const list = document.getElementById('upcoming-list');
  const upcoming = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (upcoming.length === 0) {
    list.innerHTML = '<p class="empty-state">All caught up! No pending tasks.</p>';
    return;
  }

  const stageLabels = ['Not Started', 'Learning', 'Practicing', 'Completed'];
  const stageColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  list.innerHTML = upcoming.map(task => {
    const dueDate = new Date(task.deadline).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    const isOverdue = new Date(task.deadline) < new Date();
    const stage = task.stage || 0;
    const stagePercent = Math.round((stage / 3) * 100);

    return `
      <div class="upcoming-item ${isOverdue ? 'overdue' : ''}" onclick="goToTask('${task._id}')">
        <div>
          <div class="upcoming-subject">${task.subject} - ${task.topic}</div>
          <div class="upcoming-meta">
            <span class="upcoming-stage" style="color: ${stageColors[stage]}">${stageLabels[stage]}</span>
            <span class="upcoming-sep">|</span>
            <span class="upcoming-date ${isOverdue ? 'overdue-text' : ''}">${isOverdue ? 'Overdue - ' : ''}${dueDate}</span>
          </div>
        </div>
        <div class="upcoming-progress-ring">
          <svg width="42" height="42" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="17" fill="none" stroke="#1a1a30" stroke-width="4"/>
            <circle cx="21" cy="21" r="17" fill="none" stroke="${stageColors[stage]}" stroke-width="4"
              stroke-dasharray="${stagePercent * 1.07} 107" stroke-linecap="round"
              transform="rotate(-90 21 21)" style="transition: stroke-dasharray 0.4s"/>
          </svg>
          <span class="ring-text" style="color: ${stageColors[stage]}">${stagePercent}%</span>
        </div>
      </div>
    `;
  }).join('');
}

async function handleAddTask(e) {
  e.preventDefault();
  const subject = document.getElementById('subject').value;
  const topic = document.getElementById('topic').value;
  const deadline = document.getElementById('deadline').value;
  const priority = document.getElementById('priority').value;

  await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ subject, topic, deadline, priority })
  });

  document.getElementById('task-form').reset();
  closeModal();
  fetchTasks();
}

function goToTask(taskId) {
  const tasksNav = document.querySelector('.nav-item:nth-child(2)');
  showSection('tasks', tasksNav);
  setTimeout(() => {
    const cards = document.querySelectorAll('.task-card');
    cards.forEach(card => {
      if (card.innerHTML.includes(taskId)) {
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, 100);
}

function toggleTaskExpand(el) {
  const isExpanding = !el.classList.contains('expanded');
  el.classList.toggle('expanded');
  expandedTaskId = isExpanding ? el.dataset.taskId : null;
}

function closeExpand(btn) {
  const card = btn.closest('.task-card');
  card.classList.remove('expanded');
  expandedTaskId = null;
}

async function setStage(id, newStage) {
  // Find current task stage
  const task = allTasks.find(t => t._id === id);
  if (!task) return;

  // Toggle: if clicking a completed stage, set to the one before it
  let targetStage = newStage;
  if (newStage <= (task.stage || 0) && newStage > 0) {
    targetStage = newStage - 1;
  }

  const completed = targetStage === 3;
  expandedTaskId = id; // Keep card open
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ stage: targetStage, completed })
  });
  fetchTasks();
}

async function toggleTask(id, completed) {
  const stage = completed ? 3 : 0;
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ completed, stage })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  fetchTasks();
}

// ========== MODAL ==========
function openModal() {
  document.getElementById('task-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('task-modal').classList.add('hidden');
}

// Keyboard shortcut to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
