import { Deck } from "@/components/deck/Deck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { PlayerDeck, PlayerDeckCard } from "@/interfaces/Deck";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/hooks/use-toast";

import { CustomFetch } from "@/lib/CustomFetch";
import { verifyTextInput } from "@/lib/form";

interface MainProps {
    decks: Array<PlayerDeck>,
    reload_deck: () => void,
}

export function Main({ decks, reload_deck }:MainProps){
    const [selectedDeck, setSelectedDeck] = useState<string>(decks[0]?.deck_name);
    const [newDeckName, setNewDeckName] = useState<string>("");
    const [allCards, setAllCards] = useState<Array<PlayerDeckCard>>([]);
    const { toast } = useToast();

    useEffect(() => {
        setSelectedDeck(decks[0]?.deck_name);
        console.log(decks[0]?.deck_name);
    }, [decks]);
    
    useEffect(() => {
        getAllCards();
    }, [])

    async function getAllCards(){
        const { response, error } = await CustomFetch('/card');
        if(error){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        if(response?.success){
            setAllCards(response.cards);

            return;
        }else{
            return toast({
                title: "Error",
                variant: "destructive",
                description: response.message
            });
        }
    }

    async function newDeckForm(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const { correct, message } = verifyTextInput(newDeckName || "");

        if(!correct){
            return toast({
                title: "Error",
                variant: "destructive",
                description: message,
            });
        }
        const { response, error } = await CustomFetch('/deck/new', {
            method: 'POST',
            body: JSON.stringify({ name: newDeckName}),
        })

        if(error){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        if(response?.success){
            await reload_deck();
            setSelectedDeck(newDeckName);
            setNewDeckName("");

            return toast({
                title: "Success",
                variant: "default",
                description: "Votre deck à été créer",
            });
        }else{
            return toast({
                title: "Error",
                variant: "destructive",
                description: response.message
            });
        }
    }



    return(
        <main className="py-10 px-2 lg:px-8">
            <Tabs defaultValue={selectedDeck}>
                <TabsList>
                    {decks.map((el, i) => (
                        <TabsTrigger key={i} value={el.deck_name}>{el.deck_name}</TabsTrigger>
                    ))}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="link">New</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form onSubmit={newDeckForm}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Une nouvelle compo ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Créer votre deck ici
                                    </AlertDialogDescription>
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Nom</Label>
                                        <Input value={newDeckName} onChange={e => setNewDeckName(e.target.value)} id="name" placeholder="Nom du deck" />
                                    </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-4">
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction type="submit">Valider</AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </TabsList>
                {decks.map((el, i) => (
                    <TabsContent key={i} value={el.deck_name}>
                        <Deck 
                            key={i}
                            id={el.deck_id}
                            card_list={allCards}
                            deck={el}
                        />
                    </TabsContent>
                ))}
            </Tabs>

        </main>
    )
}