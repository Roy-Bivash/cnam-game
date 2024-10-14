import express, { json } from 'express';
const router = express.Router();

import { authenticateToken } from '../lib/auth.js';




router.get('/', authenticateToken, async (req, res) => {
    const db = req.db;
    const playerId = req.user.id;

    try {
        const decks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    d.id AS deck_id, 
                    d.deck_name,
                    c.id AS card_id, 
                    c.name AS card_name,
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
            const { deck_id, deck_name, card_id, card_name, image_url, health, damage } = deck;

            if (!result[deck_id]) {
                result[deck_id] = {
                    deck_id: deck_id,
                    deck_name: deck_name,
                    cards: []
                };
            }

            if (card_id) {
                result[deck_id].cards.push({
                    id:card_id,
                    name: card_name,
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

router.get('/delete/:deckId', authenticateToken, async (req, res) => {
    const db = req.db;
    const { deckId } = req.params;

    try {
        // First, check if the deck belongs to the authenticated player
        const deck = await new Promise((resolve, reject) => {
            db.get(`
                SELECT * FROM decks WHERE id = ? AND player_id = ?
            `, [deckId, req.user.id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (!deck) {
            return res.status(404).json({ error: 'Deck not found or does not belong to the player.' });
        }

        // Start a transaction to ensure everything gets deleted properly
        await new Promise((resolve, reject) => {
            db.run('BEGIN TRANSACTION', [], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Delete the deck from deck_cards (many-to-many relation)
        await new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM deck_cards WHERE deck_id = ?
            `, [deckId], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });

        // Delete the deck from decks table
        await new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM decks WHERE id = ?
            `, [deckId], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });

        // Commit the transaction
        await new Promise((resolve, reject) => {
            db.run('COMMIT', [], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Send response after successful deletion
        res.status(200).json({ success: true, message: 'Deck deleted successfully' });

    } catch (error) {
        console.error(error);

        // If something goes wrong, rollback the transaction
        await new Promise((resolve, reject) => {
            db.run('ROLLBACK', [], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(500).json({ success: false, message: 'An error occurred while deleting the deck.' });
    }
});


export default router;