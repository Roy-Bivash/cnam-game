import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CustomFetch } from "@/lib/CustomFetch";
  

interface DeckProps{
    id:number,
    deck: PlayerDeck,
    card_list: Array<PlayerDeckCard>,
    reload_deck: () => void,
}
export function Deck({ id, deck, card_list, reload_deck }: DeckProps){
    const { toast } = useToast();
    const [newCard, setNewCard] = useState<number>();

    async function addCardToDeck(){
        if(!newCard){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Veuillez selectionner une carte",
            });
        }

        const { response, error } = await CustomFetch('/card/add', {
            method: 'POST',
            body: JSON.stringify({ 
                cardId: newCard,
                deckId: id
            }),
        })

        if(error){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }

        if(response?.success){
            reload_deck();
            return toast({
                title: "Success",
                variant: "default",
                description: "La carte a été ajouté",
            });
        }else{
            return toast({
                title: "Error",
                variant: "destructive",
                description: response.message
            });
        }

    }

    async function deleteDeck(){
        const { response, error } = await CustomFetch(`/deck/delete/${id}`);

        if(error){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        if(response?.success){
            reload_deck();
            return toast({
                title: "Success",
                variant: "default",
                description: "Deck supprimé",
            });
        }else{
            return toast({
                title: "Error",
                variant: "destructive",
                description: response.message
            });
        }
    }

    async function removeCardFromDeck(carteId: number){
        // console.log(`remove : ${carteId} from ${id}`);
        // TODO
    }

    return(
        <>
            <div className="flex justify-between items-center py-1">
                <h4 className="text-xl capitalize">{ deck.deck_name }</h4>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant={"destructive"}>Supprimer</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Voulez vous supprimer ce deck ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Supprimer le deck
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-4">
                            <AlertDialogCancel>Non</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteDeck}>Oui</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Separator orientation="horizontal" />
            <div className="mt-2 grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                {deck.cards.map((el, i) => (
                    <DeckCard 
                        key={i}
                        carte={el}
                        removeCardFromDeck={removeCardFromDeck}
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
                                    <Select defaultValue={newCard?.toString() || ""} onValueChange={value => setNewCard(parseInt(value))}>
                                        <SelectTrigger className="w-[250px]">
                                            <SelectValue placeholder="Cartes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {card_list.map((el, i) => (
                                                <SelectItem key={i} value={el.id.toString()}>{el.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-4">
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={addCardToDeck}>Valider</AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Card>
            </div>
        </>
    )
}