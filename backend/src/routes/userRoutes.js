import express, { json } from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

import { hashPassword, comparePassword } from "../lib/password.js";
import { authenticateToken } from '../lib/auth.js';

router.get('/list', (req, res) => {
    const db = req.db;
    db.all('SELECT id, pseudo, email, admin FROM players', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch players' });
        }
        res.json({ message: 'List of players', data: rows });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT id, pseudo, admin, password FROM players WHERE email=?;', [email], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Error: Login or password incorrect" });
        }

        const user = rows[0];
        const match = await comparePassword(password, user.password);

        if (match) {
            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    pseudo: user.pseudo,
                    admin: user.admin,
                },
                config.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set the token as an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', 
                maxAge: 3600000,
            });

            return res.json({
                success: true,
                message: "Login successful",
            });
        }

        return res.status(401).json({ success: false, message: "Error: Login or password incorrect" });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Failed to fetch players' });
    }
});

router.post('/register', async (req, res) => {
    const { pseudo, email, password } = req.body;
    const db = req.db;

    try {
        // Check if the email already exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM players WHERE email = ?', [email], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Error: Email already in use" });
        }

        // Hash the password before storing it
        const hashedPassword = await hashPassword(password);

        // Insert the new user into the database
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO players (pseudo, email, password, admin) VALUES (?, ?, ?, 0)', [pseudo, email, hashedPassword], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this); // Return the insert result
            });
        });

        return res.status(201).json({ success: true, message: "User created" });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Failed to create user' });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    let userInfo = null;
    const db = req.db;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT id, pseudo, email, admin, rank, wins, losses, created_at FROM players WHERE id=?;', [req.user.id], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        if (rows.length != 0) {
            userInfo = rows[0];
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({
        success: true,
        message: "User info retrieved successfully",
        user: userInfo
    });
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // This immediately expires the cookie
    });

    return res.json({
        success: true,
        message: "Logged out successfully"
    });
});



export default router;
