import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeckCard } from "../deckCard/DeckCard";
import { PlayerDeckCard, PlayerDeck } from "@/interfaces/Deck";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

interface DeckProps{
    id:number,
    deck: PlayerDeck,
    card_list: Array<PlayerDeckCard>
}
export function Deck({ id, deck, card_list }: DeckProps){
    async function addCardToDeck(){
        // TODO
    }

    return(
        <>
            <div className="flex justify-between items-center py-1">
                <h4 className="text-xl capitalize">{ deck.deck_name }</h4>
                <Button variant={"destructive"}>Supprimer</Button>
            </div>

            <Separator orientation="horizontal" />
            <div className="mt-2 grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                {deck.cards.map((el, i) => (
                    <DeckCard 
                        key={i}
                        carte={el}
                    />
                ))}
                <Card className="">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full h-full text-xl">Ajouter</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Carte</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        AJouter une carte a votre deck
                                    </AlertDialogDescription>
                                    <Select>
                                        <SelectTrigger className="w-[250px]">
                                            <SelectValue placeholder="Cartes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {card_list.map((el, i) => (
                                                <SelectItem key={i} value={el.name}>{el.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-4">
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction type="submit">Valider</AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Card>
            </div>
        </>
    )
}