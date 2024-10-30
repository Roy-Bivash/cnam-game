import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from 'socket.io-client';

import { config } from "@/config/config";
import { Button } from "@/components/ui/button";

export default function Queue() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [inQueue, setInQueue] = useState(false);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);

    const { deck_id } = useParams();  // Get deck_id from URL
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io(config.SERVER_URL, {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('joinQueue', { deck_id });
            setInQueue(true);
        });

        newSocket.on('queueJoined', (data: { position: number }) => {
            setQueuePosition(data.position);
            console.log(`Position in queue: ${data.position}`);
        });

        newSocket.on('matchFound', (data: { gameId: string, opponent: string, player: string, starting: boolean, deckId: string }) => {
            console.log(`Match found! Opponent: ${data.opponent}`);
            // Navigate to game screen with game data
            navigate(`/game/${data.gameId}`, { state: { opponent: data.opponent, player: data.player, deckId: data.deckId } });
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.emit('leaveQueue');
                newSocket.disconnect();
            }
        };
    }, [deck_id, navigate]);

    const handleLeaveQueue = () => {
        if (socket) {
            socket.emit('leaveQueue');
            setInQueue(false);
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <div className="text-2xl mb-4">Finding a match...</div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <div className="mt-4 text-gray-600">
                    {queuePosition ? `Position in queue: ${queuePosition}` : 'This might take a few moments'}
                </div>
            </div>
            <Button variant="ghost" onClick={handleLeaveQueue}>Abandon</Button>
        </div>
    );
}
