import { FC } from "react";
import Notification from "./Notification";
import { Empty } from "antd";
import { NotificationResource } from "../../../resources";

type NotificationDialogProps = {
    notifications: NotificationResource[]
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    notifications
}) => {
   

    return <div className="flex flex-col gap-y-2 max-w-[400px] py-2 px-2 rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <div>
            <span className="text-xl font-semibold">Thông báo của bạn</span>
        </div>
        {notifications?.length === 0 && <Empty description='Chưa có thông báo nào' />}
        {notifications?.map(notification => <Notification key={notification.id} notification={notification} />)}
     
    </div>
};

export default NotificationDialog;
