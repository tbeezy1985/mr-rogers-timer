let timer;
let timeLeft;

function startTimer(minutes, message) {
    clearInterval(timer);
    timeLeft = minutes * 60;
    updateDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            showNotification(message);
            if (message.includes("Mr. Rogers")) {
                showMrRogersMessage();
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
    startTimer(20, "Mr. Rogers: 'I'm proud of you, you know that.'\nStart your break.");
}

function startBreak(minutes) {
    startTimer(minutes, "Break over! Ready for another work session?");
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

function showMrRogersMessage() {
    const img = document.createElement("img");
    img.src = "https://i.imgur.com/nM5Z3vX.jpeg"; // Replace with a permanent image URL
    img.style.width = "300px";
    img.style.marginTop = "20px";
    document.body.appendChild(img);
}
