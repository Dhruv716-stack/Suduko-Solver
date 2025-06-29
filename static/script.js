let stopwatchInterval, timerInterval;
let stopwatchTime = 0;
let timerTime = 0;
let stopwatchRunning = false;
let timerRunning = false;
let triesLeft = 3;
let solutionBoard = [];

function loadBoard(puzzle) {
    const board = document.getElementById('board');
    board.innerHTML = '';
    document.getElementById("feedback").innerHTML = "";
    triesLeft = 3;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("input");
            cell.type = "number";
            cell.min = "1";
            cell.max = "9";
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.classList.add("cell");
            if (puzzle[r][c] !== 0) {
                cell.value = puzzle[r][c];
                cell.disabled = true;
            }
            board.appendChild(cell);
        }
    }

    fetch("/solution")
        .then(res => res.json())
        .then(data => solutionBoard = data);
}

function updateStopwatch() {
    stopwatchTime++;
    const mins = Math.floor(stopwatchTime / 60).toString().padStart(2, '0');
    const secs = (stopwatchTime % 60).toString().padStart(2, '0');
    document.getElementById("stopwatch").textContent = `Stopwatch: ${mins}:${secs}`;
}

function updateTimer() {
    if (timerTime <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        alert("⏲️ Time's up!");
        revealSolution();
        return;
    }
    timerTime--;
    const mins = Math.floor(timerTime / 60).toString().padStart(2, '0');
    const secs = (timerTime % 60).toString().padStart(2, '0');
    document.getElementById("timer").textContent = `Timer: ${mins}:${secs}`;
}

function startStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    stopwatchRunning = true;
    stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function toggleStopwatchPause() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    } else {
        stopwatchRunning = true;
        stopwatchInterval = setInterval(updateStopwatch, 1000);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    const selected = document.getElementById("timerSelect").value;
    timerTime = parseInt(selected);
    timerRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
}

function toggleTimerPause() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
    } else {
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function revealSolution() {
    document.querySelectorAll('.cell').forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        cell.value = solutionBoard[r][c];
        cell.disabled = true;
    });
    clearInterval(stopwatchInterval);
    clearInterval(timerInterval);
}

function resetBoard() {
    stopwatchTime = 0;
    timerTime = 0;
    document.getElementById("stopwatch").textContent = "Stopwatch: 00:00";
    document.getElementById("timer").textContent = "Timer: --:--";
    clearInterval(stopwatchInterval);
    clearInterval(timerInterval);
    fetch("/new")
        .then(res => res.json())
        .then(loadBoard);
}

function submitSolution() {
    const cells = document.querySelectorAll('.cell');
    let correct = true;
    cells.forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if (!cell.disabled && parseInt(cell.value) !== solutionBoard[r][c]) {
            correct = false;
        }
    });

    const feedback = document.getElementById("feedback");
    if (correct) {
        feedback.innerHTML = `<h2 style="color: green;">🎉 Congratulations! You solved it! 🥳</h2>
        <img src="https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif" width="200"/>`;
        clearInterval(timerInterval);
        clearInterval(stopwatchInterval);
        document.querySelectorAll('.cell').forEach(c => c.disabled = true);
    } else {
        triesLeft--;
        if (triesLeft > 0) {
            feedback.innerHTML = `<p style="color: red;">❌ Incorrect! You have ${triesLeft} tries left.</p>`;
        } else {
            feedback.innerHTML = `<p style="color: darkred;">🚫 No more tries! Here's the correct solution:</p>`;
            revealSolution();
        }
    }
}

function toggleMode() {
    const body = document.body;
    const label = document.getElementById("modeLabel");
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");

    if (body.classList.contains("dark-mode")) {
        label.textContent = "🌙 Dark Mode";
    } else {
        label.textContent = "🌞 Light Mode";
    }
}


// Initial board load
fetch("/new")
    .then(res => res.json())
    .then(loadBoard);
