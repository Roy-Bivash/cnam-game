import { Deck } from "@/components/deck/Deck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { PlayerDeck } from "@/interfaces/Deck";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/hooks/use-toast";

import { CustomFetch } from "@/lib/CustomFetch";
import { verifyTextInput } from "@/lib/form";

interface MainProps {
    decks: Array<PlayerDeck>
}

export function Main({ decks }:MainProps){
    const [selectedDeck, setSelectedDeck] = useState<string>(decks[0]?.deck_name);
    const [newDeckName, setNewDeckName] = useState<string>("");
    const { toast } = useToast();

    useEffect(() => {
        setSelectedDeck(decks[0]?.deck_name);
    }, [decks]);


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
            <ScrollArea className="w-full mt-2">
                <div className="flex w-max">
                    {decks.map((el, i) => (
                        <Button 
                            key={i}
                            variant="link" 
                            disabled={(el.deck_name == selectedDeck)} 
                        >
                            { el.deck_name }
                        </Button>
                    ))}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="link" className="p-0">New</Button>
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
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction type="submit">Valider</AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Deck />


            <Tabs defaultValue={selectedDeck} className="w-[400px]">
                <TabsList>

                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

        </main>
    )
}