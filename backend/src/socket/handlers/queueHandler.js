export class QueueHandler {
    constructor(io) {
        this.io = io;
        this.matchmakingQueue = [];
    }

    handleJoinQueue(socket) {
        const player = {
            id: socket.user.id,
            pseudo: socket.user.pseudo,
            socketId: socket.id
        };

        if (!this.matchmakingQueue.find(p => p.id === player.id)) {
            this.matchmakingQueue.push(player);
            socket.emit('queueJoined', { position: this.matchmakingQueue.length });
            
            if (this.matchmakingQueue.length >= 2) {
                this.createMatch();
            }
        }
    }

    handleLeaveQueue(socket) {
        this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== socket.user.id);
        socket.emit('queueLeft');
    }

    handleDisconnect(socket) {
        this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== socket.user.id);
        console.log(`User disconnected: ${socket.user.pseudo}`);
    }

    createMatch() {
        const player1 = this.matchmakingQueue.shift();
        const player2 = this.matchmakingQueue.shift();
        
        const gameId = `game-${Date.now()}`;
        
        this.io.to(player1.socketId).emit('matchFound', {
            gameId,
            opponent: player2.pseudo,
            starting: true
        });
        
        this.io.to(player2.socketId).emit('matchFound', {
            gameId,
            opponent: player1.pseudo,
            starting: false
        });
    }
}

