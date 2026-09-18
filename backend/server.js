require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    login,
    createToken
} = require("./auth");

const minecraft = require("./minecraft");

const app = express();
const PORT = process.env.PORT || 3000;

const sessions = new Set();

app.use(cors());
app.use(express.json());

function requireAuth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated."
        });
    }

    const token = header.slice(7);

    if (!sessions.has(token)) {
        return res.status(401).json({
            success: false,
            message: "Invalid session."
        });
    }

    next();
}


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "ZLIH SMP",
        online: true
    });
});


// Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!login(username, password)) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });
    }

    const token = createToken();

    sessions.add(token);

    res.json({
        success: true,
        token
    });
});


// Logout
app.post("/api/logout", requireAuth, (req, res) => {
    const token = req.headers.authorization.slice(7);

    sessions.delete(token);

    res.json({
        success: true
    });
});


// Server status
app.get("/api/server/status", requireAuth, (req, res) => {
    res.json(minecraft.getStatus());
});


// Start
app.post("/api/server/start", requireAuth, (req, res) => {
    res.json(minecraft.startServer());
});


// Stop
app.post("/api/server/stop", requireAuth, (req, res) => {
    res.json(minecraft.stopServer());
});


// Restart
app.post("/api/server/restart", requireAuth, (req, res) => {
    res.json(minecraft.restartServer());
});


// Command
app.post("/api/server/command", requireAuth, (req, res) => {
    const command = req.body.command;

    if (!command || typeof command !== "string") {
        return res.status(400).json({
            success: false,
            message: "Command missing."
        });
    }

    res.json({
        success: minecraft.sendCommand(command)
    });
});


// Console
app.get("/api/server/console", requireAuth, (req, res) => {
    res.json({
        console: minecraft.getConsole()
    });
});


app.listen(PORT, () => {
    console.log("");
    console.log("================================");
    console.log("          ZLIH SMP");
    console.log("================================");
    console.log(`Backend: http://localhost:${PORT}`);
    console.log("================================");
    console.log("");
});