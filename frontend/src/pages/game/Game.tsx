import { useParams, useLocation } from "react-router-dom";

interface LocationState {
    opponent: string;
    player: string;
    deckId: string;
    opponentDeckId: string;
}

export default function Game() {
    const { id } = useParams();
    const location = useLocation();
    const { opponent, player, deckId, opponentDeckId } = location.state as LocationState;

    return (
        <div>
            <h3 className="text-3xl">Game page</h3>
            <p>Game ID: {id}</p>
            <p>Your Name: {player}</p>
            <p>Your Deck ID: {deckId}</p>
            <p>Opponent's Name: {opponent}</p>
            <p>Opponent's Deck ID: {opponentDeckId}</p>
        </div>
    );
}
