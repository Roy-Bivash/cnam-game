import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { initializeSocket } from './src/services/socket.js';

import router from "./src/router.js";
import { config } from "./src/config/config.js";
import { initDb } from "./src/database/db.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
}));

initDb().then((db) => {
    console.log("Database initialized");

    // Make the db available in all routes
    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    app.use('/', router);

    const server = app.listen(config.PORT, () => {
        console.log(`Backend app listening on port ${config.PORT}`);
    });

    const io = initializeSocket(server);
 
}).catch((err) => {
    console.error("Failed to initialize database:", err);
});
