import { FC } from "react";
import { useSelector } from "react-redux";
import ForbbidenPage from "../areas/customers/pages/ForbbidenPage";
import { selectAuth } from "../feature/auth/authSlice";

type RoleBasedGuardProps = {
    accessibleRoles: string[];
    element: React.ReactNode;
}

const RoleBasedGuard: FC<RoleBasedGuardProps> = ({
    accessibleRoles,
    element
}) => {
    const { user } = useSelector(selectAuth);

    if(!accessibleRoles.some(r => user?.roles.includes(r))) return <ForbbidenPage />;

    return element
};

export default RoleBasedGuard;