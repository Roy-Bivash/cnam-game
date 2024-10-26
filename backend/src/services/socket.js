import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Queue to store players waiting for a match
let matchmakingQueue = [];

// Reuse the token verification logic but adapt it for socket.io
function authenticateSocketToken(socket, next) {
    // For socket.io, we'll get the token from the auth handshake data
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1];
    
    if (!token) {
        return next(new Error("Unauthorized: No token provided"));
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new Error("Forbidden: Invalid token"));
        }
        
        // Attach user data to socket instance
        socket.user = user;
        next();
    });
}

export function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: config.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Use the authentication middleware
    io.use(authenticateSocketToken);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.pseudo}`);

        // Handle player joining queue
        socket.on('joinQueue', () => {
            const player = {
                id: socket.user.id,
                pseudo: socket.user.pseudo,
                socketId: socket.id
            };

            // Verifier si le joueur n'est pas déjà en queu
            if (!matchmakingQueue.find(p => p.id === player.id)) {
                matchmakingQueue.push(player);
                socket.emit('queueJoined', { position: matchmakingQueue.length });
                
                // If we have enough players, create a match
                if (matchmakingQueue.length >= 2) {
                    const player1 = matchmakingQueue.shift();
                    const player2 = matchmakingQueue.shift();
                    
                    const gameId = `game-${Date.now()}`;
                    
                    // Notify both players
                    io.to(player1.socketId).emit('matchFound', {
                        gameId,
                        opponent: player2.pseudo,
                        starting: true
                    });
                    
                    io.to(player2.socketId).emit('matchFound', {
                        gameId,
                        opponent: player1.pseudo,
                        starting: true
                    });
                }
            }
        });


        // If a players leaves the queue
        // socket.on('leaveQueue', () => {
        //     matchmakingQueue = matchmakingQueue.filter(p => p.id !== socket.user.id);
        //     socket.emit('queueLeft');
        // });

        // If a user disconnects
        socket.on('disconnect', () => {
            matchmakingQueue = matchmakingQueue.filter(p => p.id !== socket.user.id);
            console.log(`User disconnected: ${socket.user.pseudo}`);
        });
    });

    return io;
}