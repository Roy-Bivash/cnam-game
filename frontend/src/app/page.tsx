import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Home() {
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
                        <CardHeader>
                            <CardTitle>Connexion</CardTitle>
                            <CardDescription>
                                Connectez vous pour pouvoir jouer au jeu des FIP du CNAM
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="nom.prenom@exemple.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Mots de passe</Label>
                                <Input id="password" type="password" placeholder="***" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Se connecter</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="inscription">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inscription</CardTitle>
                            <CardDescription>
                                Inscrivez vous pour pouvoir jouer au jeu des FIP du CNAM
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="nom.prenom@exemple.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Pseudo</Label>
                                <Input id="Pseudo" type="text" placeholder="Pseudo1234" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Mots de passe</Label>
                                <Input id="password" type="password" placeholder="***" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password2">Confirmez votre mots de passe</Label>
                                <Input id="password2" type="password" placeholder="***" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>S'inscrire</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
      </main>
  );
}
