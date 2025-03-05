let timer;
let timeLeft;
let darkMode = false;
const bellSound = new Audio('https://tbeezy1985.github.io/mr-rogers-timer/assets/bell.mp3');
let tasks = [];

function startTimer(minutes, message, showGif = false, isLongBreak = false) {
    clearInterval(timer);
    timeLeft = minutes * 60;
    updateDisplay();

    if (isLongBreak) {
        let goToNetflix = confirm("Would you like to watch a show on Netflix during your break? Click 'OK' to go to Netflix or 'Cancel' to start the timer.");
        if (goToNetflix) {
            window.open("https://www.netflix.com/browse", "_blank");
            return;
        }
    }

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            bellSound.play().catch(error => console.log("Audio play failed:", error));
            showNotification(message);
            if (showGif) {
                showMrRogersGif();
            }
        }
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startWorkSession() {
    startTimer(20, "Mr. Brauker: 'I'm proud of you, you know that.'\nStart your break.", true);
}

function startBreak(minutes) {
    startTimer(minutes, "Break over! Ready for another work session?", false, minutes === 23);
}

function setCustomTimer() {
    let minutes = prompt("Enter timer duration in minutes:");
    if (minutes && !isNaN(minutes) && minutes > 0) {
        startTimer(parseInt(minutes), "Custom timer completed!", true);
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let task = taskInput.value.trim();
    if (task !== "") {
        tasks.push(task);
        let taskList = document.getElementById("taskList");
        let li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
        taskInput.value = "";
    }
}

function sendTaskList() {
    if (tasks.length === 0) {
        alert("No tasks to log.");
        return;
    }

    let formURL = "https://docs.google.com/forms/d/e/1FAIpQLScYQMt86ohmIy9xcEgjFrxSSoa_w56FuYBIULG0hnx8jgsoag/formResponse";
    let entryID = "entry.2065484795"; // Your actual Entry ID

    tasks.forEach(task => {
        let fullURL = `${formURL}?${entryID}=${encodeURIComponent(task)}`;
        window.open(fullURL, "_blank");
    });

    alert("Tasks logged successfully!");
    tasks = [];
    document.getElementById("taskList").innerHTML = "";
}

function showNotification(message) {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Time's Up!", { body: message });
            }
        });
    } else {
        alert(message);
    }
}

function showMrRogersGif() {
    const img = document.createElement("img");
    img.src = "https://tbeezy1985.github.io/mr-rogers-timer/assets/mr-rogers-proud-of-you.gif";
    img.style.width = "300px";
    img.style.marginTop = "20px";
    document.body.appendChild(img);
}
