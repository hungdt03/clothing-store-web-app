import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router";
import Connector from './app/signalR/signalr-connection'
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "./feature/auth/authSlice";

function App() {
    const { user } = useSelector(selectAuth)
    
    useEffect(() => {
        if (user)
            Connector();
    }, [])

    return <RouterProvider router={router} />
}

export default App;
