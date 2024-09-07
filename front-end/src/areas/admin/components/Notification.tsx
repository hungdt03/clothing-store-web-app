import { FC } from "react";
import images from "../../../assets";
import { Image } from "antd";
import { NotificationResource } from "../../../resources";
import { formatDateTime } from "../../../utils/format";

type NotificationProps = {
    notification: NotificationResource
}

const Notification: FC<NotificationProps> = ({
    notification
}) => {
    return <div className="cursor-pointer flex gap-x-2 items-center justify-between hover:bg-orange-50 p-2 rounded-xl">
        <div className="w-[90px]">
            <Image preview={false} className="object-cover rounded-full" src={notification.recipient.avatar ?? images.demoMenth} />
        </div>
        <div className="flex flex-col gap-y-1">
            <p><b>{notification.recipient.name}</b> {notification.content}</p>
            <p className={`text-sm ${notification.haveRead ? 'text-gray-500' : 'text-primary font-semibold'}`}>{formatDateTime(new Date(notification.createdAt))}</p>
        </div>
    </div>
};

export default Notification;
