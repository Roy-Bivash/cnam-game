import express from "express";
import cors from "cors";

import router from "./src/router.js";
import { config } from "./src/config/config.js";
import { initDb } from "./src/database/db.js";

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
    origin: config.CLIENT_URL, // Allow requests only from frontend
    credentials: true, // Enable credentials (cookies/auth headers)
    optionsSuccessStatus: 200 // Legacy browser support for some browsers
}));

initDb().then((db) => {
    console.log("Database initialized");

    // Make the db available in all routes
    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    // Routes
    app.use('/', router);

    // Home route
    app.get('/', (req, res) => {
        res.json({ message: "Welcome to the backend" });
    });

    // Start the server after the DB is initialized
    app.listen(config.PORT, () => {
        console.log(`Backend app listening on port ${config.PORT}`);
    });
}).catch((err) => {
    console.error("Failed to initialize database:", err);
});
