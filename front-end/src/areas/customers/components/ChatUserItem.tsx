import { FC } from "react";
import { UserContactResource } from "../../../resources";
import { Avatar } from "antd";
import images from "../../../assets";
import { formatTimeTypeAgo } from "../../../utils/format";

type ChatUserItemProps = {
    group: UserContactResource
    onClick: () => void
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    group,
    onClick
}) => {
    return <div onClick={onClick} className="cursor-pointer flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md">
        <div className="relative">
            <Avatar
                src={images.demoMenth}
            />
            {group.user.isOnline && <span className="absolute bottom-0 right-1 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>}
        </div>

        <div className="flex flex-col flex-1">
            <b>{group.user.name}</b>
            <div className="flex items-center justify-between text-[14px] gap-x-2">
                <p className="w-32 truncate">{group.latestMessage}</p>
                <span className="text-sky-600">{group.latestTime ? formatTimeTypeAgo(new Date(group.latestTime)) : 'Chưa kết nối'}</span>
            </div>

        </div>
    </div>
};

export default ChatUserItem;