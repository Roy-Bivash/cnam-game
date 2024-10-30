import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import Queue from "@/pages/queue/Queue";
import Game from "@/pages/game/Game";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />
    },
    {
        path: "/queue/:deck_id",
        element: <Queue />
    },
    {
        path: "/game/:id",
        element: <Game />
    }
]);

export {
    routes
}