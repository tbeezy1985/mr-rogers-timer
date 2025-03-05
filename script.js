document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded, adding event listeners.");

    let addTaskBtn = document.getElementById("addTaskBtn");
    let sendTaskBtn = document.getElementById("sendTaskBtn");
    let darkModeToggle = document.querySelector("button[onclick='toggleDarkMode()']");

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", addTask);
    }

    if (sendTaskBtn) {
        sendTaskBtn.addEventListener("click", sendTaskList);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", toggleDarkMode);
    }

    // Ensure dark mode is enabled by default and remembers preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
});

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
