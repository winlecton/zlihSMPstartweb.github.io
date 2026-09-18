
```javascript
/*
    ZLIH SMP CONTROL PANEL

    This version is a frontend DEMO.

    Nothing here actually controls Minecraft yet.

    Later we will replace the demo functions with requests
    to the Control API running on your Minecraft host.
*/

let serverRunning = false;
let players = 0;
let ram = 0;

const serverStatus = document.getElementById("serverStatus");
const statusDot = document.getElementById("statusDot");
const connectionStatus = document.getElementById("connectionStatus");
const statusDescription = document.getElementById("statusDescription");

const playerCount = document.getElementById("playerCount");
const ramUsage = document.getElementById("ramUsage");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const stopButton = document.getElementById("stopButton");

const actionMessage = document.getElementById("actionMessage");

const consoleElement = document.getElementById("console");
const commandInput = document.getElementById("commandInput");
const sendCommand = document.getElementById("sendCommand");
const clearConsole = document.getElementById("clearConsole");

const logoutButton = document.getElementById("logoutButton");
const saveSettings = document.getElementById("saveSettings");


// -----------------------------
// AUTH CHECK
// -----------------------------

if (sessionStorage.getItem("zlihLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// -----------------------------
// CONSOLE
// -----------------------------

function addConsoleLine(message) {
    const line = document.createElement("div");

    const time = new Date().toLocaleTimeString();

    line.textContent = `[${time}] ${message}`;

    consoleElement.appendChild(line);

    consoleElement.scrollTop = consoleElement.scrollHeight;
}


// -----------------------------
// UPDATE SERVER DISPLAY
// -----------------------------

function updateServerDisplay() {

    if (serverRunning) {

        serverStatus.textContent = "ONLINE";
        serverStatus.style.color = "var(--green)";

        statusDot.className = "status-dot online-dot";

        connectionStatus.textContent = "● ONLINE";
        connectionStatus.className = "connection online";

        statusDescription.textContent =
            "The Minecraft network is running.";

        playerCount.textContent = players;

        ramUsage.textContent =
            ram.toFixed(1) + " GB";

    } else {

        serverStatus.textContent = "OFFLINE";
        serverStatus.style.color = "var(--red)";

        statusDot.className = "status-dot offline-dot";

        connectionStatus.textContent = "● OFFLINE";
        connectionStatus.className = "connection offline";

        statusDescription.textContent =
            "The Minecraft network is currently offline.";

        playerCount.textContent = "0";
        ramUsage.textContent = "0 GB";
    }
}


// -----------------------------
// START SERVER
// -----------------------------

startButton.addEventListener("click", function () {

    if (serverRunning) {
        actionMessage.textContent = "The server is already running.";
        return;
    }

    actionMessage.textContent =
        "Starting Minecraft server...";

    addConsoleLine("Starting Velocity...");

    setTimeout(function () {

        serverRunning = true;
        players = 0;
        ram = 1.8;

        updateServerDisplay();

        addConsoleLine("Velocity started.");
        addConsoleLine("Connecting backend servers...");
        addConsoleLine("Lobby started.");
        addConsoleLine("SMP backend started.");
        addConsoleLine("Server is ONLINE.");

        actionMessage.textContent =
            "Server started successfully.";

    }, 1500);
});


// -----------------------------
// STOP SERVER
// -----------------------------

stopButton.addEventListener("click", function () {

    if (!serverRunning) {
        actionMessage.textContent = "The server is already offline.";
        return;
    }

    actionMessage.textContent =
        "Stopping Minecraft server...";

    addConsoleLine("Stopping SMP...");
    addConsoleLine("Stopping Lobby...");
    addConsoleLine("Stopping Velocity...");

    setTimeout(function () {

        serverRunning = false;
        players = 0;
        ram = 0;

        updateServerDisplay();

        addConsoleLine("Server stopped.");

        actionMessage.textContent =
            "Server stopped.";

    }, 1000);
});


// -----------------------------
// RESTART SERVER
// -----------------------------

restartButton.addEventListener("click", function () {

    if (!serverRunning) {
        actionMessage.textContent =
            "Server is offline. Start it instead.";

        return;
    }

    actionMessage.textContent =
        "Restarting server...";

    addConsoleLine("Restart requested.");

    serverRunning = false;
    updateServerDisplay();

    setTimeout(function () {

        addConsoleLine("Starting server again...");

        serverRunning = true;
        ram = 1.9;

        updateServerDisplay();

        addConsoleLine("Server restarted successfully.");

        actionMessage.textContent =
            "Server restarted.";

    }, 2000);
});


// -----------------------------
// SEND COMMAND
// -----------------------------

function executeCommand() {

    const command = commandInput.value.trim();

    if (!command) {
        return;
    }

    addConsoleLine("> " + command);

    if (!serverRunning) {

        addConsoleLine(
            "Server is offline. Command was not executed."
        );

    } else {

        /*
            Later this becomes:

            fetch("https://YOUR-API/command", {
                method: "POST",
                ...
            })
        */

        addConsoleLine(
            "[DEMO] Command would be sent to Minecraft."
        );
    }

    commandInput.value = "";
}

sendCommand.addEventListener("click", executeCommand);

commandInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        executeCommand();
    }

});


// -----------------------------
// CLEAR CONSOLE
// -----------------------------

clearConsole.addEventListener("click", function () {

    consoleElement.innerHTML = "";

    addConsoleLine("Console cleared.");

});


// -----------------------------
// SAVE SETTINGS
// -----------------------------

saveSettings.addEventListener("click", function () {

    const motd =
        document.getElementById("motd").value;

    const difficulty =
        document.getElementById("difficulty").value;

    const maxPlayers =
        document.getElementById("maxPlayers").value;

    const whitelist =
        document.getElementById("whitelist").checked;

    addConsoleLine(
        `[DEMO] Settings changed: MOTD="${motd}", Difficulty=${difficulty}, MaxPlayers=${maxPlayers}, Whitelist=${whitelist}`
    );

    actionMessage.textContent =
        "Settings saved locally for this demo.";

});


// -----------------------------
// LOGOUT
// -----------------------------

logoutButton.addEventListener("click", function () {

    sessionStorage.removeItem("zlihLoggedIn");

    window.location.href = "login.html";

});


// -----------------------------
// INITIAL STATE
// -----------------------------

updateServerDisplay();
```
