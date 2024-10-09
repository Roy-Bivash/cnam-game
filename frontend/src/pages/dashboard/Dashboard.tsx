import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/lib/current";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import char1 from "@/assets/characters/1.png";
import char2 from "@/assets/characters/2.png";
import char3 from "@/assets/characters/3.png";

export default function Dashboard(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();

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

    return(
        <>
            <nav className="px-6 py-3 border-b">
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
                                    <AlertDialogTitle>Vous avez un code ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <Input name="code" id="code" type="text" placeholder="Votre code" />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Continue</AlertDialogAction>
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

                    <ScrollArea className="w-full">
                        <div className="flex w-max">
                            <Button variant="link" disabled>Deck 1</Button>
                            <Button variant="link">Deck 2</Button>
                            <Button variant="link">Deck 3</Button>
                            <Button variant="link">Deck 4</Button>
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