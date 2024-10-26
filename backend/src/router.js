import express from 'express';
import userRoutes from './routes/userRoutes.js';
import deckRoutes from './routes/deckRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

const router = express.Router();

// Use different routers for specific route paths
router.use('/users', userRoutes);
router.use('/deck', deckRoutes);
router.use('/card', cardRoutes);
router.use('/game', gameRoutes);

export default router;
