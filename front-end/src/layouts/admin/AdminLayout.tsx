import { FC, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Connector from '../../app/signalR/signalr-connection'
import { NotificationResource } from "../../resources";

const AdminLayout: FC = () => {
    const location = useLocation();
    const [isShowLayout, setIsShowLayout] = useState(true)
    const { events } = Connector();

    useEffect(() => {
        events(undefined, (notification : NotificationResource) => {
            console.log(notification)
        })
    }, [])

    
    useEffect(() => {
        if(location.pathname.includes('/blog/create')) setIsShowLayout(true)
    }, [])
    return <div className="flex">
        {isShowLayout && <Sidebar />}

        <div className="flex flex-col w-full h-screen">
           {isShowLayout &&  <Header />}

            <div className="h-screen overflow-y-auto shadow-inner bg-slate-100 p-6">
                <Outlet />
            </div>
        </div>
    </div>;
};

export default AdminLayout;
