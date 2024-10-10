import express from 'express';
import userRoutes from './routes/userRoutes.js';
import deckRoutes from './routes/deckRoutes.js';

const router = express.Router();

// Use different routers for specific route paths
router.use('/users', userRoutes);
router.use('/deck', deckRoutes);

export default router;
