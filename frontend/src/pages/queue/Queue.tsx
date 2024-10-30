import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from 'socket.io-client';

import { config } from "@/config/config";
import { Button } from "@/components/ui/button";

export default function Queue() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [inQueue, setInQueue] = useState(false);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
    const [opponent, setOpponent] = useState<string | null>(null);  // Track opponent's name when match is found
    
    const { deck_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io(config.SERVER_URL, {
            withCredentials: true
        });

        // Socket connection established
        newSocket.on('connect', () => {
            console.log('Connected to server');
            // Join queue upon connection
            newSocket.emit('joinQueue');
            setInQueue(true);
        });

        // Listen for position updates in the queue
        newSocket.on('queueJoined', (data: { position: number }) => {
            setQueuePosition(data.position);
            console.log(`Position in queue: ${data.position}`);
        });

        // Listen for match found event
        newSocket.on('matchFound', (data: { gameId: string, opponent: string, starting: boolean }) => {
            console.log(`Match found with ${data.opponent}`);
            setOpponent(data.opponent);
            // Navigate to game screen (for example, /game/:gameId)
            navigate(`/game/${data.gameId}`);
        });

        setSocket(newSocket);

        return () => {
            // Clean up connection on component unmount
            if (newSocket) {
                // Notify backend that player is leaving queue
                newSocket.emit('leaveQueue');  
                newSocket.disconnect();
            }
        };
    }, [navigate]);

    // Event handler for leaving the queue
    const handleLeaveQueue = () => {
        if (socket) {
            socket.emit('leaveQueue');
            setInQueue(false);
            // Navigate to the dashboard or desired location
            navigate('/dashboard');  
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="h-[70vh] flex flex-col items-center justify-center">
                {opponent ? (
                    <div className="text-2xl mb-4">Match found! Opponent: {opponent}</div>
                ) : (
                    <>
                        <div className="text-2xl mb-4">Finding a match...</div>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        <div className="mt-4 text-gray-600">
                            {queuePosition ? `Position in queue: ${queuePosition}` : 'This might take a few moments'}
                        </div>
                    </>
                )}
            </div>
            <Button variant="ghost" onClick={handleLeaveQueue}>Abandon</Button>
        </div>
    );
}
