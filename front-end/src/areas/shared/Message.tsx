import { Avatar } from "antd";
import { FC } from "react";
import { MessageResource } from "../../resources";
import images from "../../assets";

type MessageProps = {
    isMe?: boolean;
    message: MessageResource
}

const Message: FC<MessageProps> = ({
    isMe = false,
    message
}) => {
    return <div className={`flex gap-x-2 ${isMe && 'justify-end'} ${!isMe && 'items-end'}`}>
        {!isMe && <Avatar
            src={images.demoMenth}
        />}
        
        <div className={`max-w-[60%] break-words ${isMe ? 'bg-sky-600 text-white' : 'bg-gray-200'} px-2 py-1 rounded-xl text-sm`}>
            {message.content}
        </div>
    </div>
};

export default Message;