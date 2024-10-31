// gameHandler.js

import { getDeckById } from '../database/deckService.js'; // Assuming you have this function available to fetch deck data
import { shuffleArray } from '../utils/helpers.js'; // Helper to shuffle the deck, if not available create a function for it

export class GameHandler {
    constructor(io) {
        this.io = io;
        this.activeGames = new Map();
    }

    // Initialize game state with both players, decks, and initial setup
    async initializeGame(gameId, player1, player2) {
        const deck1 = await getDeckById(player1.deckId);
        const deck2 = await getDeckById(player2.deckId);

        const initialState = {
            players: {
                [player1.id]: {
                    id: player1.id,
                    pseudo: player1.pseudo,
                    health: 100,
                    deck: shuffleArray(deck1),
                    hand: [], // Will be populated with 4 random cards from deck
                    table: [] // Cards placed on the table (up to 4)
                },
                [player2.id]: {
                    id: player2.id,
                    pseudo: player2.pseudo,
                    health: 100,
                    deck: shuffleArray(deck2),
                    hand: [],
                    table: []
                }
            },
            currentPlayer: player1.id, // Player 1 starts by default
            gameId: gameId,
            turns: [],
        };

        // Draw 4 cards for each player as initial hand
        initialState.players[player1.id].hand = initialState.players[player1.id].deck.splice(0, 4);
        initialState.players[player2.id].hand = initialState.players[player2.id].deck.splice(0, 4);

        this.activeGames.set(gameId, initialState);

        this.io.to(gameId).emit('gameStarted', { gameId, gameState: initialState });
        console.log(`Game started with ID: ${gameId}`);
    }

    handlePlayCard(socket, data) {
        const { gameId, cardIndex } = data;
        const game = this.activeGames.get(gameId);
        if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
        }

        const player = game.players[socket.user.id];
        if (!player || game.currentPlayer !== player.id) {
            socket.emit('error', { message: 'Not your turn!' });
            return;
        }

        // Ensure valid card index and table slot availability
        if (cardIndex < 0 || cardIndex >= player.hand.length || player.table.length >= 4) {
            socket.emit('error', { message: 'Invalid action: table full or card index out of bounds' });
            return;
        }

        const [card] = player.hand.splice(cardIndex, 1); // Remove card from hand
        player.table.push(card); // Place card on table

        // Emit updated game state
        this.io.to(gameId).emit('cardPlayed', {
            gameId,
            playerId: player.id,
            card,
            table: player.table
        });
    }

    handleAttack(socket, data) {
        const { gameId, attackerIndex, targetType, targetIndex } = data; // targetType: 'card' or 'player'
        const game = this.activeGames.get(gameId);
        if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
        }

        const player = game.players[socket.user.id];
        const opponentId = Object.keys(game.players).find(id => id !== player.id);
        const opponent = game.players[opponentId];
        

        if (!player || game.currentPlayer !== player.id) {
            socket.emit('error', { message: 'Not your turn!' });
            return;
        }

        // Validate attacker index
        if (attackerIndex < 0 || attackerIndex >= player.table.length) {
            socket.emit('error', { message: 'Invalid attacker index' });
            return;
        }

        const attackerCard = player.table[attackerIndex];

        if (targetType === 'card') {
            // Attack opponent's card
            if (targetIndex < 0 || targetIndex >= opponent.table.length) {
                socket.emit('error', { message: 'Invalid target index' });
                return;
            }

            const targetCard = opponent.table[targetIndex];
            targetCard.health -= attackerCard.damage; // Apply damage to target card
            attackerCard.health -= targetCard.damage; // Counterattack if opponent's card is still alive

            // Remove defeated cards
            if (targetCard.health <= 0) {
                opponent.table.splice(targetIndex, 1);
            }
            if (attackerCard.health <= 0) {
                player.table.splice(attackerIndex, 1);
            }

            // Emit updated game state
            this.io.to(gameId).emit('cardAttack', {
                gameId,
                attacker: { playerId: player.id, card: attackerCard },
                target: { playerId: opponent.id, card: targetCard },
                tables: { playerTable: player.table, opponentTable: opponent.table }
            });

        } else if (targetType === 'player') {
            // Attack opponent directly
            opponent.health -= attackerCard.damage;

            // Emit updated game state
            this.io.to(gameId).emit('playerAttacked', {
                gameId,
                attacker: { playerId: player.id, card: attackerCard },
                opponent: { playerId: opponent.id, health: opponent.health }
            });

            if (opponent.health <= 0) {
                this.endGame(gameId, player.id); // Player wins
            }
        }

        // End the current turn and switch players
        this.switchTurn(game);
    }

    handleEndTurn(socket, data) {
        const { gameId } = data;
        const game = this.activeGames.get(gameId);
        if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
        }

        const player = game.players[socket.user.id];
        if (!player || game.currentPlayer !== player.id) {
            socket.emit('error', { message: 'Not your turn!' });
            return;
        }

        this.switchTurn(game);
        this.io.to(gameId).emit('turnEnded', { gameId, currentPlayer: game.currentPlayer });
    }

    switchTurn(game) {
        const currentPlayerId = game.currentPlayer;
        const nextPlayerId = Object.keys(game.players).find(id => id !== currentPlayerId);
        game.currentPlayer = nextPlayerId;

        // Optionally, draw a card at the start of each player's turn
        const player = game.players[nextPlayerId];
        if (player.deck.length > 0 && player.hand.length < 4) {
            const newCard = player.deck.shift();
            player.hand.push(newCard);
        }
    }

    endGame(gameId, winnerId) {
        const game = this.activeGames.get(gameId);
        if (game) {
            this.io.to(gameId).emit('gameEnded', { gameId, winner: winnerId });
            this.activeGames.delete(gameId);
            console.log(`Game with ID: ${gameId} ended. Winner: ${winnerId}`);
        }
    }
}
