import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { config } from "@/config/config";

interface LocationState {
    opponent: string;
    player: string;
    deckId: string;
    opponentDeckId: string;
}

export default function Game() {
    const { id: gameId } = useParams();
    const location = useLocation();
    const { opponent, player, deckId, opponentDeckId } = location.state as LocationState;


    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(config.SERVER_URL, {
            withCredentials: true,
            query: { gameId, deckId }
        });

        // Handle successful connection
        newSocket.on("connect", () => {
            console.log("Connected to game socket with game ID:", gameId);
            
            // TODO
        });

        newSocket.on("turnUpdate", (data) => {
            console.log("Turn updated:", data);
            // TODO
        });

        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [gameId, deckId]);


    function playCard(cardId: string, position: string){
        // if (socket) {
        //     socket.emit("playCard", { gameId, cardId, position });
        // }

    }

    return (
        <div>
            <h3 className="text-3xl">Game page</h3>
            <p>Game ID: {gameId}</p>
            <p>Your Name: {player}</p>
            <p>Your Deck ID: {deckId}</p>
            <p>Opponent's Name: {opponent}</p>
            <p>Opponent's Deck ID: {opponentDeckId}</p>
        </div>
    );
}
