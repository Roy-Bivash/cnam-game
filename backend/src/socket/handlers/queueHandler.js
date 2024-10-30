export class QueueHandler {
    constructor(io) {
        this.io = io;
        this.matchmakingQueue = [];
    }

    handleJoinQueue(socket, data = {}) { 
        const { deck_id } = data;
    
        const player = {
            id: socket.user.id,
            pseudo: socket.user.pseudo,
            socketId: socket.id,
            deckId: deck_id
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
    
        // Send match details to each player, including deckId
        this.io.to(player1.socketId).emit('matchFound', {
            gameId,
            opponent: player2.pseudo,
            player: player1.pseudo,
            deckId: player1.deckId,  // Pass player's deck ID
            opponentDeckId: player2.deckId,  // Pass opponent's deck ID
            starting: true
        });
    
        this.io.to(player2.socketId).emit('matchFound', {
            gameId,
            opponent: player1.pseudo,
            player: player2.pseudo,
            deckId: player2.deckId,
            opponentDeckId: player1.deckId,
            starting: false
        });
    }
}

