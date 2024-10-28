import { Server } from 'socket.io';
import { authenticateSocketToken } from './middleware/authMiddleware.js';
import { QueueHandler } from './handlers/queueHandler.js';
import { GameHandler } from './handlers/gameHandler.js';

export class SocketManager {
    constructor(server, config) {
        this.io = new Server(server, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.queueHandler = new QueueHandler(this.io);
        this.gameHandler = new GameHandler(this.io);

        this.initialize();
    }

    initialize() {
        this.io.use(authenticateSocketToken);

        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.user.pseudo}`);

            // Queue events
            socket.on('joinQueue', () => this.queueHandler.handleJoinQueue(socket));
            socket.on('leaveQueue', () => this.queueHandler.handleLeaveQueue(socket));

            // Game events
            socket.on('playCard', (data) => this.gameHandler.handlePlayCard(socket, data));
            socket.on('endTurn', (data) => this.gameHandler.handleEndTurn(socket, data));

            // Disconnect
            socket.on('disconnect', () => this.queueHandler.handleDisconnect(socket));
        });
    }
}
