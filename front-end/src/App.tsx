import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router";
import Connector from './app/signalR/signalr-connection'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialize, selectAuth } from "./feature/auth/authSlice";
import { getAccessToken } from "./utils/auth";
import { AppDispatch } from "./app/store";
import accountService from "./services/user-service";

function App() {
    const { user } = useSelector(selectAuth)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        (async () => {
            const accessToken = getAccessToken();
            if (!accessToken) {
                return dispatch(initialize({
                    isAuthenticated: false, user: undefined
                }));
            }
            try {
                const response = await accountService.getUserDetails();
                if (response.success) {
                    dispatch(initialize({ isAuthenticated: true, user: response.data }));
                } else {
                    dispatch(initialize({
                        isAuthenticated: false, user: undefined
                    }));
                }

            } catch {
                dispatch(initialize({ isAuthenticated: false, user: undefined }));
            }
        })();

    }, []);
    
    useEffect(() => {
        if (user)
            Connector();
    }, [])

    return <RouterProvider router={router} />
}

export default App;
