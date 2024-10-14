import express, { json } from 'express';
const router = express.Router();

import { authenticateToken } from '../lib/auth.js';

router.get('/', authenticateToken, async (req, res) => {
    const db = req.db;

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

router.post('/add', authenticateToken, async (req, res) => {
    const db = req.db;
    const deckId = req.body.deckId;
    const newCardId = req.body.cardId;

    try {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO deck_cards (deck_id, card_id) VALUES(?,?);', [deckId, newCardId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });
        return res.status(201).json({ success: true, message: "Card added to deck" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while retrieving cards.' });
    }
})

router.get('/remove/:deckId/:cardId', authenticateToken, async (req, res) => {
    const db = req.db;
    const { deckId, cardId } = req.params;
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM deck_cards WHERE deck_id=? AND card_id=?;', [deckId, cardId], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });
        return res.status(201).json({ success: true, message: "Card removed from deck" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while removing cards.' });
    }
})


export default router;