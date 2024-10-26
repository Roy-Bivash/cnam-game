import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import Queue from "@/pages/queue/Queue";

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
    }
]);

export {
    routes
}