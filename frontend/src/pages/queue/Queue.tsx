import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomFetch } from "@/lib/CustomFetch";

export function Queue() {
    const [error, setError] = useState<string | null>(null);
    const [queueStatus, setQueueStatus] = useState<string>("joining");
    const { deck_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        const joinQueue = async () => {
            const { response, error } = await CustomFetch("/game/queue/join", {
                method: "POST",
                body: JSON.stringify({ deckId: deck_id }),
            });

            if (!mounted) return;

            if (error) {
                setError("Failed to join queue: " + error.message);
                return;
            }

            if (response.status === "matched") {
                // Redirect to game page with the game ID
                navigate(`/game/${response.gameId}`);
            } else {
                setError("Unexpected response from server");
            }
        };

        joinQueue();

        // Cleanup: Leave queue if component unmounts
        return () => {
            mounted = false;
            CustomFetch("/game/queue/leave", { method: "POST" });
        };
    }, [deck_id, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {error ? (
                <div className="text-red-500 text-xl">{error}</div>
            ) : (
                <>
                    <div className="text-2xl mb-4">Finding a match...</div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <div className="mt-4 text-gray-600">
                        This might take a few moments
                    </div>
                </>
            )}
        </div>
    );
}