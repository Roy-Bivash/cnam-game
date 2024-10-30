import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from 'socket.io-client';

import { config } from "@/config/config";

import { Button } from "@/components/ui/button";

export default function Queue() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [inQueue, setInQueue] = useState(false);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);    
    
    const { deck_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(config.SERVER_URL, {
          withCredentials: true
        });

        // New connection
        newSocket.on('connect', () => {
          console.log('Connected to server');
        });
    
        
        /**
         * TODO :
         * emettre "joinQueue" pour rejoindre la queu
         * si on recoit "matchFound" alors le joueuer a bien rejoint la queu (afficher un message)
         *  
         * A la reception de "matchFound" :
         * - Un joueur a été trouvé, ces infos seront recu (afficher les)
         * - Rediriger vers la page de jeux
         */

    
        setSocket(newSocket);
    
        return () => {
            // Disconnect if the user quite the page
            newSocket.disconnect();
        };
    }, [navigate]);
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <div className="text-2xl mb-4">Finding a match...</div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <div className="mt-4 text-gray-600">
                    This might take a few moments
                </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Abandonner</Button>
        </div>
    );
}

