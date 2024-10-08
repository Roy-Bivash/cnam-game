import express, { json } from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

import { hashPassword, comparePassword } from "../lib/password.js";
import { authenticateToken } from '../lib/auth.js';

router.get('/list', (req, res) => {
    const db = req.db;
    db.all('SELECT id, pseudo, email, admin FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json({ message: 'List of users', data: rows });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT id, pseudo, admin, password FROM users WHERE email=?;', [email], (err, rows) => {
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
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/register', async (req, res) => {
    const { pseudo, email, password } = req.body;
    const db = req.db;

    try {
        // Check if the email already exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
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
            db.run('INSERT INTO users (pseudo, email, password, admin) VALUES (?, ?, ?, 0)', [pseudo, email, hashedPassword], function(err) {
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

router.get('/me', authenticateToken, (req, res) => {
    const userInfo = {
        id: req.user.id,
        pseudo: req.user.pseudo,
        admin: req.user.admin
    };

    res.json({
        success: true,
        message: "User info retrieved successfully",
        user: userInfo
    });
});




export default router;
