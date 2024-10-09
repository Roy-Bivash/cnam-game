import { getMe } from "@/lib/current";
import { useEffect } from "react";

export default function Dashboard(){
    useEffect(() => {
        console.log(getMe());
    })

    return(
        <main className="min-h-screen">
            <h1 className="text-3xl">Dashboard</h1>
        </main>
    )
}