import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/lib/current";
import { Header } from "./header/Header";
import { Main } from "./main/Main";

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
            <Header />
            <Main />
        </>
    )
}