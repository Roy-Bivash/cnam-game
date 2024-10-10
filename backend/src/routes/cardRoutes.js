import express, { json } from 'express';
const router = express.Router();

import { authenticateToken } from '../lib/auth.js';

router.get('/', authenticateToken, async (req, res) => {
    const db = req.db;
    const playerId = req.user.id;

    try {
        // Ensure `db.all` returns a promise correctly.
        const cards = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM cards;`, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        // Now ensure we have an array and can iterate with forEach
        if (!Array.isArray(cards)) {
            throw new Error("Expected an array, got something else.");
        }

        res.status(200).json({
            success: true,
            message: "cards retrieved successfully",
            cards: cards
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while retrieving cards.' });
    }
});




export default router;