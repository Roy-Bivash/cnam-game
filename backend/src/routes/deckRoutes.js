import express, { json } from 'express';
const router = express.Router();

import { authenticateToken } from '../lib/auth.js';




router.get('/', authenticateToken, async (req, res) => {
    const db = req.db;
    const playerId = req.user.id;

    try {
        // Ensure `db.all` returns a promise correctly.
        const decks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    d.id AS deck_id, 
                    d.deck_name,
                    c.id AS card_id, 
                    c.image_url, 
                    c.health, 
                    c.damage
                FROM decks d
                LEFT JOIN deck_cards dc ON d.id = dc.deck_id
                LEFT JOIN cards c ON dc.card_id = c.id
                WHERE d.player_id = ?
            `, [playerId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        // Now ensure we have an array and can iterate with forEach
        if (!Array.isArray(decks)) {
            throw new Error("Expected an array, got something else.");
        }

        const result = {};

        decks.forEach(deck => {
            const { deck_id, deck_name, card_id, image_url, health, damage } = deck;

            if (!result[deck_id]) {
                result[deck_id] = {
                    deck_id: deck_id,
                    deck_name: deck_name,
                    cards: []
                };
            }

            if (card_id) {
                result[deck_id].cards.push({
                    card_id,
                    image_url,
                    health,
                    damage
                });
            }
        });

        // Convert the result object into an array of decks
        const decksArray = Object.values(result);

        res.status(200).json({
            success: true,
            message: "decks retrieved successfully",
            decks: decksArray
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while retrieving decks.' });
    }
});


router.post('/new', authenticateToken, async (req, res) => {
    const db = req.db;
    const playerId = req.user.id; 
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Deck name is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO decks (player_id, deck_name) 
                VALUES (?, ?)
            `, [playerId, name], function (err) {
                if (err) return reject(err);
                resolve({ deckId: this.lastID });
            });
        });

        res.status(201).json({ 
            success: true, 
            message: 'Deck created successfully', 
            deck_id: result.deckId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            error: 'An error occurred while creating the deck.' 
        });
    }
});



export default router;