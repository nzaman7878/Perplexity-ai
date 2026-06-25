import { createBrowserRouter } from "react-router";
import Login from "../features/pages/Login";
import Register from "../features/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/components/Protected";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected>
            <Dashboard />
        </Protected>
    },
    {
        path: "/dashboard",
        element: <Navigate to="/" replace />
    }
])