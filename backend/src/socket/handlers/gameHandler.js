export class GameHandler {
    constructor(io) {
        this.io = io;
        this.activeGames = new Map();
    }

    handlePlayCard(socket, data) {
        const { gameId, cardId, position } = data;

        // ...
        
    }

    handleEndTurn(socket, data) {
        const { gameId } = data;
        // ...
    }
}
