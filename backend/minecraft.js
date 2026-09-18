const { spawn } = require("child_process");
const path = require("path");

let serverProcess = null;
let consoleBuffer = [];

const serverDir = process.env.MINECRAFT_DIR;
const serverJar = process.env.MINECRAFT_JAR || "paper.jar";
const ram = process.env.MINECRAFT_RAM || "4G";

function log(text) {
    consoleBuffer.push(text);

    if (consoleBuffer.length > 500) {
        consoleBuffer.shift();
    }

    process.stdout.write(text);
}

function startServer() {
    if (serverProcess) {
        return {
            success: false,
            message: "Server is already running."
        };
    }

    const jarPath = path.join(serverDir, serverJar);

    log("[ZLIH] Starting Minecraft server...\n");

    serverProcess = spawn(
        "java",
        [
            `-Xms${ram}`,
            `-Xmx${ram}`,
            "-jar",
            jarPath,
            "nogui"
        ],
        {
            cwd: serverDir,
            windowsHide: false
        }
    );

    serverProcess.stdout.on("data", data => {
        log(data.toString());
    });

    serverProcess.stderr.on("data", data => {
        log(data.toString());
    });

    serverProcess.on("error", error => {
        log(`[ZLIH] ERROR: ${error.message}\n`);
        serverProcess = null;
    });

    serverProcess.on("close", code => {
        log(`[ZLIH] Server stopped. Exit code: ${code}\n`);
        serverProcess = null;
    });

    return {
        success: true,
        message: "Minecraft server starting."
    };
}

function stopServer() {
    if (!serverProcess) {
        return {
            success: false,
            message: "Server is not running."
        };
    }

    sendCommand("stop");

    return {
        success: true,
        message: "Stop command sent."
    };
}

function restartServer() {
    if (!serverProcess) {
        return startServer();
    }

    sendCommand("stop");

    return {
        success: true,
        message: "Server restarting."
    };
}

function sendCommand(command) {
    if (!serverProcess) {
        return false;
    }

    serverProcess.stdin.write(command + "\n");

    return true;
}

function getStatus() {
    return {
        online: serverProcess !== null
    };
}

function getConsole() {
    return consoleBuffer;
}

module.exports = {
    startServer,
    stopServer,
    restartServer,
    sendCommand,
    getStatus,
    getConsole
};