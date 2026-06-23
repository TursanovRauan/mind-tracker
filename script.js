// Часы и дата
const clockEl = document.getElementById('clock');
if (clockEl) {
    setInterval(() => {
        clockEl.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

const welcome = document.getElementById('welcome-msg');
if (welcome) {
    const hours = new Date().getHours();
    let greeting = 'Добрый вечер';
    if (hours < 12) greeting = 'Доброе утро';
    else if (hours < 18) greeting = 'Добрый день';
    welcome.innerText = `${greeting}, сегодня ${new Date().toLocaleDateString()}`;
}

// Задачи
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    const list = document.getElementById('task-list');
    if (!list) return;
    list.innerHTML = '';
    tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.className = `task-item ${t.done ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <span class="category-tag">${t.category}</span>
                <span class="task-text">${t.text}</span>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${i})" class="btn-check">✓</button>
                <button onclick="deleteTask(${i})" class="btn-del">✕</button>
            </div>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value;
    if (!text) return;
    tasks.push({
        text,
        category: document.getElementById('task-category').value,
        priority: document.getElementById('task-priority').value,
        done: false
    });
    input.value = '';
    renderTasks();
}

function toggleTask(i) { tasks[i].done = !tasks[i].done; renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); renderTasks(); }

// Продуктивность
function calculateProductivity() {
    const w = parseFloat(document.getElementById('prod-work').value) || 0;
    const r = parseFloat(document.getElementById('prod-rest').value) || 0;
    if (w + r === 0) return;
    const res = Math.round((w / (w + r)) * 100);
    const resultDiv = document.getElementById('calc-result');
    resultDiv.innerText = `Твой КПД: ${res}%`;
    resultDiv.style.display = 'inline-block';
}

// Pomodoro
let pomoInterval, pomoTime;
function startPomo() {
    if (pomoInterval) return;
    pomoTime = pomoTime || document.getElementById('work-time').value * 60;
    
    document.querySelector('.btn-start').innerText = 'В процессе...';
    
    pomoInterval = setInterval(() => {
        pomoTime--;
        let m = Math.floor(pomoTime / 60), s = pomoTime % 60;
        document.getElementById('pomo-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        
        if (pomoTime <= 0) {
            clearInterval(pomoInterval);
            pomoInterval = null;
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
            alert('Время вышло! Отдохни немного.');
        }
    }, 1000);
}

function pausePomo() { 
    clearInterval(pomoInterval); 
    pomoInterval = null; 
    document.querySelector('.btn-start').innerText = 'Продолжить';
}

function resetPomo() { 
    pausePomo(); 
    pomoTime = null; 
    document.getElementById('pomo-display').innerText = "25:00"; 
    document.querySelector('.btn-start').innerText = 'Старт';
}

// Контакты
const form = document.getElementById('contact-form');
if (form) {
    form.onsubmit = (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        status.innerText = "Ракета запущена! Свяжемся скоро.";
        status.style.color = "#38bdf8";
        form.reset();
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('task-list')) renderTasks();
});