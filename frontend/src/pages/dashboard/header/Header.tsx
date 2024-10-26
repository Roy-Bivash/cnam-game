import { useNavigate } from "react-router-dom";
import { logOut } from "@/lib/current";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlayerDeck } from "@/interfaces/Deck";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
interface HeaderInterface{
    link:string,
    decks: Array<PlayerDeck>,
}

export function Header({ link, decks }: HeaderInterface){
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedDeckForMatch, setSelectedDeckForMatch] = useState<number>();

    async function logOutPlayer(){
        const res = await logOut();

        if(!res){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        navigate('/');
    }

    function enterMatchMaking(){
        if(!selectedDeckForMatch){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Veuillez selectionner un deck"
            })
        }

        console.log(`Enter queu with deck: ${selectedDeckForMatch}`);
        
        // TODO
    }

    return(
        <nav className="px-6 py-3 border-b flex justify-between items-center">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost">Quitter</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Vous nous quittez déjà ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Quitter le jeux
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={logOutPlayer}>Oui</AlertDialogAction>
                            <AlertDialogCancel>Non</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <ul className="flex gap-4 items-center justify-end">
                    <li className="text-xs">
                        Online: 23
                    </li>
                    <Separator className="h-5" orientation="vertical" />
                    <li>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="secondary">Jouer avec un amie</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Jouer avec un amie</AlertDialogTitle>
                                    <Separator orientation="horizontal" />
                                </AlertDialogHeader>
                                <AlertDialogDescription className="pb-3 flex flex-col">
                                    <span>
                                        Partager votre code : <Button variant="link" className="p-0">{ link }</Button>
                                    </span>
                                    <span className="pt-8 pb-2">Vous avez un code ?</span>
                                    <span className="flex w-full items-center space-x-2">
                                        <Input name="code" id="code" type="text" placeholder="Code d'invitation" />
                                        <Button type="submit">Join</Button>
                                    </span>
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                    <li>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="default">Jouer</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Quel deck utiliser ?</AlertDialogTitle>
                                    <Separator orientation="horizontal" />
                                </AlertDialogHeader>
                                <AlertDialogDescription className="pb-3 flex flex-col">
                                    <Select defaultValue={selectedDeckForMatch?.toString() || ""} onValueChange={value => setSelectedDeckForMatch(parseInt(value))}>
                                        <SelectTrigger className="w-[250px]">
                                            <SelectValue placeholder="Choix ..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {decks.map((el, i) => (
                                                <SelectItem key={i} value={el.deck_id.toString()}>{el.deck_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogAction onClick={enterMatchMaking}>Lancer</AlertDialogAction>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                </ul>
            </nav>
    )
}