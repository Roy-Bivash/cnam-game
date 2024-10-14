import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PlayerDeckCard } from "@/interfaces/Deck";

import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";

interface DeckCardProps{
    carte:PlayerDeckCard,
    removeCardFromDeck: (carteId: number) => void,
}

const image = {
    "yanis.png": char1,
    "valentin.png": char2,
    "aurian.png": char3,
    "camelia.png": char2,
    "thomas.png":char1,
    "youssef.png": char3,
    "owenn.png": char2,
    "clement.png": char3,
    "honsli.png": char2,
    "akaash.png": char3,
    "quentin.png": char3,
    "soleymane.png": char3,
    "ronan.png":char1,
    "balthazar.png": char1,
    "lucas.png": char2,
    "leo.png": char3,
    "bivash.png": char2,
    "adam.png":char1,
    "inamullah.png": char2,
};

export function DeckCard({ carte, removeCardFromDeck }: DeckCardProps){
    console.log(carte)
    return(
        <Card>
            <CardHeader>
                <div className="mb-4 relative h-64 w-full">
                    <img src={image[carte.image_url]} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <CardTitle>{carte.name}</CardTitle>
                <CardDescription>
                    <span>Health : { carte.health }</span>
                    <br />
                    <span>Damage : { carte.damage }</span>
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
                <Button variant="link" onClick={() => removeCardFromDeck(carte.id)}>Retirer</Button>
            </CardFooter>
        </Card>
    )
}