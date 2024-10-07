import express from 'express';
import userRoutes from './routes/userRoutes.js'; // Example user-related routes

const router = express.Router();

// Use different routers for specific route paths
router.use('/users', userRoutes);

export default router;
