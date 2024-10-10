import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeckCard } from "../deckCard/DeckCard";

import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";

export function Deck(){
    return(
        <>
            <h4 className="text-xl">Decks name</h4>

            <ScrollArea className="w-full mt-2">
                <div className="flex w-max">
                    <Button variant="link" disabled>Deck 1</Button>
                    <Button variant="link">Deck 2</Button>
                    <Button variant="link">Deck 3</Button>
                    <Button variant="link">Deck 4</Button>
                    <Button variant="ghost">New</Button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator orientation="horizontal" />
            <div className="mt-2 grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                <DeckCard />
                {/* <Card>
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
                <Card>
                    <CardHeader>
                        <div className="mb-4 relative h-64 w-full">
                            <img src={char1} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-end">
                        <Button variant="link">Retirer</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="mb-4 relative h-64 w-full">
                            <img src={char3} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-end">
                        <Button variant="link">Retirer</Button>
                    </CardFooter>
                </Card> */}
                <Card className="">
                    <Button variant="ghost" className="w-full h-full text-xl">Ajouter</Button>
                </Card>
            </div>
        </>
    )
}