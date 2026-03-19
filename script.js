const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const background = document.querySelector('.background');
const progressCircle = document.querySelector('.progress-ring__progress');
const notificationSound = document.getElementById('notification-sound');

let timer;
let isRunning = false;
let currentMode = 'pomodoro';
let timeLeft;
let totalTime;

// Initialize progress circle stroke arrays
const radius = progressCircle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = 0;

const modes = {
    'pomodoro': { time: 25 * 60, bgVar: 'var(--bg-pomodoro)' },
    'short-break': { time: 5 * 60, bgVar: 'var(--bg-short-break)' },
    'long-break': { time: 15 * 60, bgVar: 'var(--bg-long-break)' }
};

function init() {
    setMode('pomodoro');
    setupEventListeners();
}

function setupEventListeners() {
    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isRunning || confirm('Timer is running. Are you sure you want to switch mode?')) {
                setMode(btn.dataset.mode);
            }
        });
    });
}

function setMode(mode) {
    currentMode = mode;
    totalTime = modes[mode].time;
    timeLeft = totalTime;
    
    modeBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    background.style.backgroundImage = modes[mode].bgVar;
    
    if (isRunning) {
        pauseTimer();
    }
    
    updateDisplay();
    updateProgress();
}

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timeLeft > 0) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            updateProgress();
            
            if (timeLeft <= 0) {
                completeTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    startBtn.textContent = 'Start';
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    timeLeft = totalTime;
    updateDisplay();
    updateProgress();
}

function completeTimer() {
    pauseTimer();
    notificationSound.play().catch(e => console.log('Audio playback prevented by browser:', e));
    
    setTimeout(() => {
        alert('Time is up!');
    }, 100);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    timeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    document.title = `${formattedMinutes}:${formattedSeconds} - Zen Timer`;
}

function updateProgress() {
    const offset = circumference - (timeLeft / totalTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

document.addEventListener('DOMContentLoaded', init);
