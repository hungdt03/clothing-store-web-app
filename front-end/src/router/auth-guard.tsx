import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "../feature/auth/authSlice";
import Loading from "../areas/shared/Loading";

type AuthGuardProps = {
    element: React.ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({
    element
}) => {
    const { isAuthenticated, isInitialized } = useSelector(selectAuth)

    if(!isInitialized) return <Loading />
    
    if(!isAuthenticated) return <Navigate to='/' replace />

    return element;
};

export default AuthGuard;