import { FC } from "react";
import { Outlet } from "react-router-dom";

const ResultLayout: FC = () => {
    return <div className="h-screen flex justify-center items-center">
        <Outlet />
    </div>;
};

export default ResultLayout;
