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
        <main className="min-h-screen">
            <h1 className="text-3xl">Dashboard</h1>
        </main>
    )
}