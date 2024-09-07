import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../feature/auth/authSlice";
import { Outlet } from "react-router-dom";
import ForbbidenPage from "../areas/customers/pages/ForbbidenPage";

const AdminRoute: FC = () => {
    const { user } = useSelector(selectAuth)
    return (user?.roles?.includes('ADMIN')) ? <Outlet /> : <ForbbidenPage />
};

export default AdminRoute;
