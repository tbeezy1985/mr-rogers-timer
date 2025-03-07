document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded, adding event listeners.");

    let addTaskBtn = document.getElementById("addTaskBtn");
    let sendTaskBtn = document.getElementById("sendTaskBtn");
    let darkModeToggle = document.getElementById("toggleDarkModeBtn");
    let startWorkBtn = document.getElementById("startWorkBtn");
    let shortBreakBtn = document.getElementById("shortBreakBtn");
    let longBreakBtn = document.getElementById("longBreakBtn");
    let customTimerBtn = document.getElementById("customTimerBtn");

    if (addTaskBtn) addTaskBtn.addEventListener("click", addTask);
    if (sendTaskBtn) sendTaskBtn.addEventListener("click", sendTaskList);
    if (darkModeToggle) darkModeToggle.addEventListener("click", toggleDarkMode);
    if (startWorkBtn) startWorkBtn.addEventListener("click", startWorkSession);
    if (shortBreakBtn) shortBreakBtn.addEventListener("click", () => startBreak(5));
    if (longBreakBtn) longBreakBtn.addEventListener("click", () => startBreak(23));
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

    let email = prompt("Enter the email address to send the task list:");
    if (!email) {
        alert("Email not entered. Task list not sent.");
        return;
    }

    let taskList = document.getElementById("taskList").getElementsByTagName("li");
    if (taskList.length === 0) {
        alert("No tasks to send.");
        return;
    }

    let tasks = [];
    for (let i = 0; i < taskList.length; i++) {
        tasks.push(taskList[i].textContent.replace("❌", "").trim());
    }

    let subject = encodeURIComponent("Task List Summary");
    let body = encodeURIComponent("Here is the list of completed tasks:\n\n" + tasks.join("\n"));
    let mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    alert("Task list email prepared. Please send it using your email app.");
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
