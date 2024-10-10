import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/lib/current";
import { Header } from "./header/Header";
import { Main } from "./main/Main";
import { CustomFetch } from "@/lib/CustomFetch";
import { useToast } from "@/hooks/use-toast";

import { PlayerDeck } from "@/interfaces/Deck";
import { CurrentUser } from "@/interfaces/Users";

export default function Dashboard(){
    const { toast } = useToast();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<CurrentUser>();
    const [deckList, setDeckList] = useState<Array<PlayerDeck>>([]);

    async function getAllMyDeck(){
        const { response, error } = await CustomFetch('/deck');
    
        if(error){
            return toast({
                title: "Error",
                variant: "destructive",
                description: "Internal server error",
            });
        }
        
        if(response?.success){
            setDeckList(response.decks)
            // console.log(response.decks)
            return;
        }

        toast({
            title: "Error",
            variant: "destructive",
            description: response.message
        });
        
    }

    async function getUser(){
        const data = await getMe();
        if(!data.success){
            navigate('/');
        }
        setCurrentUser(data.user);
    }

    useEffect(() => {
        getUser();
        getAllMyDeck();
    },[])

    return(
        <>
            <Header />
            <Main
                decks={deckList}
            />
        </>
    )
}