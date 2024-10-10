import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";

export function DeckCard(){
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