import { useNavigate } from "react-router-dom";
import { logOut } from "@/lib/current";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


export function Header(){
    const navigate = useNavigate();
    const { toast } = useToast()

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
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                    <li>
                        <Button variant="default">Jouer</Button>
                    </li>
                </ul>
            </nav>
    )
}