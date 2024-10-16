import WebSocket from 'ws';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

let waitingQueue = [];

export function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        // Extract the token from cookies
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            ws.close(1008, 'Authentication failed: No token provided');
            return;
        }

        // Verify JWT
        let user;
            try {
                user = jwt.verify(token, config.JWT_SECRET);
            } catch (error) {
                ws.close(1008, 'Authentication failed: Invalid token');
            return;
        }

        console.log('User authenticated:', user);

        // Now you can add the user to the matchmaking queue or handle further requests
        ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'joinQueue') {
            waitingQueue.push({ ws, user });
            console.log(`${user.pseudo} joined the queue. Current queue size: ${waitingQueue.length}`);

            // Notify all clients about the current queue size
            broadcastQueueSize();
            
            // Check if there are enough players to start a game
            if (waitingQueue.length >= 2) {
                startGame();
            }
        }

        if (data.type === 'leaveQueue') {
            waitingQueue = waitingQueue.filter(player => player.ws !== ws);
            console.log(`${user.pseudo} left the queue. Current queue size: ${waitingQueue.length}`);
            broadcastQueueSize();
        }
        });

        ws.on('close', () => {
            // Remove the user from the queue if they disconnect
            waitingQueue = waitingQueue.filter(player => player.ws !== ws);
            broadcastQueueSize();
        });
    });

    const broadcastQueueSize = () => {
        waitingQueue.forEach(player => {
        player.ws.send(JSON.stringify({
            type: 'queueUpdate',
            queueSize: waitingQueue.length,
        }));
        });
    };

    const startGame = () => {
        // Pick two players and start the game
        const players = waitingQueue.splice(0, 2);
        players.forEach(player => {
        player.ws.send(JSON.stringify({
            type: 'startGame',
            players: players.map(p => p.user.pseudo)
        }));
        });
        console.log('Game started with players:', players.map(p => p.user.pseudo));
    };
}
