import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logOut } from "@/lib/current";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";


interface CurrentUser {
    id: number,
    pseudo: string,
    email: string,
    admin: number,
    rank: number,
    wins: number,
    losses: number,
    created_at: string
}

export default function Dashboard(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<CurrentUser>();
    const { toast } = useToast()

    useEffect(() => {
        async function getUser(){
            const data = await getMe();
            if(!data.success){
                navigate('/');
            }
            setCurrentUser(data.user);
        }
        getUser();
    },[])

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

    return(
        <>
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
                                        Partager votre code : <Button variant="link" className="p-0">#J7BU234</Button>
                                    </span>
                                    <span className="pt-8 pb-2">Vous avez un code ?</span>
                                    <span className="flex w-full items-center space-x-2">
                                        <Input name="code" id="code" type="text" placeholder="Code d'invitation" />
                                        <Button type="submit">Join</Button>
                                    </span>
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                    <li>
                        <Button variant="default">Jouer</Button>
                    </li>
                </ul>
            </nav>
            <main className="py-10 px-2 lg:px-8">

                <div>
                    <h4 className="text-xl">Decks</h4>

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
                        </Card>
                        <Card className="">
                            <Button variant="ghost" className="w-full h-full text-xl">Ajouter</Button>
                        </Card>
                    </div>
                </div>

            </main>
        </>
    )
}