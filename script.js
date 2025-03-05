document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded, adding event listeners.");

    let addTaskBtn = document.getElementById("addTaskBtn");
    let sendTaskBtn = document.getElementById("sendTaskBtn");
    let darkModeToggle = document.querySelector("button[onclick='toggleDarkMode()']");
    let startWorkBtn = document.querySelector("button[onclick='startWorkSession()']");
    let shortBreakBtn = document.querySelector("button[onclick='startBreak(5)']");
    let longBreakBtn = document.querySelector("button[onclick='startBreak(23)']");
    let customTimerBtn = document.querySelector("button[onclick='setCustomTimer()']");

    if (addTaskBtn) addTaskBtn.addEventListener("click", addTask);
    if (sendTaskBtn) sendTaskBtn.addEventListener("click", sendTaskList);
    if (darkModeToggle) darkModeToggle.addEventListener("click", toggleDarkMode);
    if (startWorkBtn) startWorkBtn.addEventListener("click", startWorkSession);
    if (shortBreakBtn) shortBreakBtn.addEventListener("click", function() { startBreak(5); });
    if (longBreakBtn) longBreakBtn.addEventListener("click", function() { startBreak(23); });
    if (customTimerBtn) customTimerBtn.addEventListener("click", setCustomTimer);

    // Ensure dark mode is enabled by default and remembers preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
});

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
    if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
    } else {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    }
}

function addTask() {
    console.log("Add Task button clicked");

    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if (!taskInput || !taskList) {
        console.error("Task input or list not found!");
        return;
    }

    let task = taskInput.value.trim();
    if (task === "") {
        alert("Please enter a task before adding.");
        return;
    }

    let li = document.createElement("li");
    li.textContent = task;

    let removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.style.marginLeft = "10px";
    removeButton.onclick = function () {
        taskList.removeChild(li);
    };

    li.appendChild(removeButton);
    taskList.appendChild(li);
    taskInput.value = "";

    console.log("Task added:", task);
}

function sendTaskList() {
    console.log("Send Task List button clicked");

    let formURL = "https://docs.google.com/forms/d/e/1FAIpQLScYQMt86ohmIy9xcEgjFrxSSoa_w56FuYBIULG0hnx8jgsoag/formResponse";
    let entryID = "entry.2065484795"; // Your actual Entry ID

    let taskList = document.getElementById("taskList").getElementsByTagName("li");
    if (taskList.length === 0) {
        alert("No tasks to log.");
        return;
    }

    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i].textContent.replace("❌", "").trim();
        let fullURL = `${formURL}?${entryID}=${encodeURIComponent(task)}`;
        console.log("Submitting task:", task, "to", fullURL);
        window.open(fullURL, "_blank");
    }

    alert("Tasks logged successfully!");
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
