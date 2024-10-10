import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PlayerDeckCard } from "@/interfaces/Deck";


import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";

interface DeckCardProps{
    carte:PlayerDeckCard
}

export function DeckCard({ carte }: DeckCardProps){
    return(
        <Card>
            <CardHeader>
                <div className="mb-4 relative h-64 w-full">
                    <img src={char2} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
                <Button variant="link">Retirer</Button>
            </CardFooter>
        </Card>
    )
}