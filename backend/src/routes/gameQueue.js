// src/gameQueue.js
export class GameQueue {
    constructor() {
        this.queue = new Map(); // playerId -> { deckId, timestamp, resolve }
        this.matches = new Map(); // gameId -> { player1Id, player2Id, status }
    }

    // Add player to queue
    addToQueue(playerId, deckId) {
        return new Promise((resolve) => {
            // Remove player if they're already in queue
            this.removeFromQueue(playerId);
            
            // Add player to queue
            this.queue.set(playerId, {
                deckId,
                timestamp: Date.now(),
                resolve
            });
            
            // Try to find a match
            this.tryMatch(playerId);
        });
    }

    // Remove player from queue
    removeFromQueue(playerId) {
        const playerQueue = this.queue.get(playerId);
        if (playerQueue) {
            this.queue.delete(playerId);
            playerQueue.resolve({ status: 'cancelled' });
        }
    }

    // Try to match player with opponent
    tryMatch(playerId) {
        const player = this.queue.get(playerId);
        if (!player) return;

        // Find oldest waiting player that isn't the current player
        let opponent = null;
        let oldestTimestamp = Infinity;

        for (const [id, data] of this.queue.entries()) {
            if (id !== playerId && data.timestamp < oldestTimestamp) {
                opponent = { id, ...data };
                oldestTimestamp = data.timestamp;
            }
        }

        if (opponent) {
            // Create a match
            const gameId = Math.random().toString(36).substring(7);
            
            // Remove both players from queue
            this.queue.delete(playerId);
            this.queue.delete(opponent.id);

            // Create match data
            const matchData = {
                gameId,
                player1: { id: playerId, deckId: player.deckId },
                player2: { id: opponent.id, deckId: opponent.deckId },
                status: 'matched'
            };

            // Store match data
            this.matches.set(gameId, matchData);

            // Resolve both players' promises
            player.resolve({ status: 'matched', gameId, matchData });
            opponent.resolve({ status: 'matched', gameId, matchData });
        }
    }
}

// src/routes/gameRoutes.js
import express from 'express';
import { authenticateToken } from '../lib/auth.js';
import { GameQueue } from '../gameQueue.js';

const router = express.Router();
const gameQueue = new GameQueue();

router.post('/queue/join', authenticateToken, async (req, res) => {
    const { deckId } = req.body;
    const playerId = req.user.id;

    try {
        const result = await gameQueue.addToQueue(playerId, deckId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to join queue' });
    }
});

router.post('/queue/leave', authenticateToken, (req, res) => {
    const playerId = req.user.id;
    gameQueue.removeFromQueue(playerId);
    res.json({ status: 'success' });
});

export default router;