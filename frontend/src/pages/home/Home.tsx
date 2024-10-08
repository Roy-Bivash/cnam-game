import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { verifyPasswordInput, verifyTextInput } from "@/lib/form";
import { CustomFetch } from "@/lib/CustomFetch";
import { wait } from "@/lib/timer";

interface FormData {
    email: string | null;
    password: string | null,
    confirm_password: string | null;
    pseudo: string | null;
}

export default function Home(){
    const { toast } = useToast()
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({ email:null, password:null, confirm_password:null, pseudo:null });

    function setForm(e:React.ChangeEvent<HTMLInputElement>){
        setFormData(prev =>({...prev, [e.target.name]:e.target.value}));
    }

    async function formLogin(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);
        const { correct, message } = verifyTextInput(formData.email || "");
        
        if(!correct){
            return toast({
                title: "Error",
                variant: "destructive",
                description: message,
            });
        }

        const { response, error } = await CustomFetch('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        if(error){
            setLoading(false);

            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        if(response?.success){
            navigate('/dashboard');
        } else{
            await wait(2);
            setLoading(false);
            return toast({
                title: "Error",
                variant: "destructive",
                description: response.message
            });
        }
    }

    async function formRegister(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("register : ");
        console.table(formData);
    }

    return (
        <main className="min-h-screen flex flex-col gap-8 items-center pt-[15vh]">
            <h2 className="text-3xl">FIP Game</h2>
            <Tabs defaultValue="connexion" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="connexion">Connexion</TabsTrigger>
                    <TabsTrigger value="inscription">Inscription</TabsTrigger>
                </TabsList>
                <TabsContent value="connexion">
                    <Card>
                        <form onSubmit={formLogin}>
                            <CardHeader>
                                <CardTitle>Connexion</CardTitle>
                                <CardDescription>
                                    Connectez vous pour pouvoir jouer au jeu des FIP du CNAM
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input onChange={setForm} value={formData.email || ""} name="email" id="email" type="email" placeholder="nom.prenom@exemple.com" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Mots de passe</Label>
                                    <Input onChange={setForm} value={formData.password || ""} name="password" id="password" type="password" placeholder="****" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Se connecter</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="inscription">
                    <Card>
                        <form onSubmit={formRegister}>
                            <CardHeader>
                                <CardTitle>Inscription</CardTitle>
                                <CardDescription>
                                    Inscrivez vous pour pouvoir jouer au jeu des FIP du CNAM
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input onChange={setForm} value={formData.email || ""} name="email" type="email" id="email" placeholder="nom.prenom@exemple.com" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Pseudo</Label>
                                    <Input onChange={setForm} value={formData.pseudo || ""} name="pseudo" type="text" id="pseudo" placeholder="exemple123" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Mots de passe</Label>
                                    <Input onChange={setForm} value={formData.password || ""} name="password" id="password" type="password" placeholder="****" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="confirm_password">Confirmez votre mots de passe</Label>
                                    <Input onChange={setForm} value={formData.confirm_password || ""} name="confirm_password" id="confirm_password" type="password" placeholder="****" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>S'inscrire</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}