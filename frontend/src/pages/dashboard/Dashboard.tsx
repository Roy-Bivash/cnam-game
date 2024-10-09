import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  

import { getMe } from "@/lib/current";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
                            <AlertDialogTrigger>
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
            <main className="py-10">

                <div id="deck_list" className="mx-5">
                    <h4 className="text-xl">Deck 1</h4>
                    <ScrollArea className="w-full">
                        <div className="flex w-max space-x-4 p-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                            
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <h4 className="text-xl">Deck 2</h4>
                    <ScrollArea className="w-full">
                        <div className="flex w-max space-x-4 p-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                            
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </main>
        </>
    )
}