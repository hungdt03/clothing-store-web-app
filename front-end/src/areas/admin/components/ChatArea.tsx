import { Avatar, Button, Input, Space, Tooltip } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { MoreOutlined, SendOutlined } from '@ant-design/icons';
import images from "../../../assets";
import Message from "../../shared/Message";
import { MessageResource, UserResource } from "../../../resources";
import messageService from "../../../services/message-service";
import Connector from '../../../app/signalR/signalr-connection'
import { MessageRequest } from "../../../app/signalR";
import { formatTimeTypeAgo } from "../../../utils/format";

type ChatAreaProps = {
    recipient: UserResource;
    senderId: string;
}

const ChatArea: FC<ChatAreaProps> = ({
    recipient,
    senderId
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageResource[]>([])
    const { sendMessage, events } = Connector();
    const [message, setMessage] = useState<MessageRequest>({
        content: '',
        recipientId: recipient.id
    });

    useEffect(() => {
        events((message) => setMessages(prev => [...prev, message]));
    }, []);


    useEffect(() => {
        if(messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])
   


    const fetchMessages = async () => {
        const response = await messageService.getAllMessages(recipient.id)
        setMessages(response.data)
    }

    useEffect(() => {
        fetchMessages();
    }, [recipient])

    const handleSendMessage = () => {
        sendMessage(message)
        setMessage({
            ...message,
            content: ''
        })
    }

    const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return <div className="flex flex-col h-full relative"> 
        <div className="flex items-center justify-between shadow-md bg-white border-[1px] border-gray-200 p-2">
            <div className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md">
                <div className="relative">
                    <Avatar
                        src={images.demoMenth}
                        size='large'
                    />
                    {recipient.isOnline && <span className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full border-2 border-white bg-green-500"></span>}
                </div>

                <div className="flex flex-col">
                    <b>{recipient.name}</b>
                    <p className="text-[13px]">
                        {recipient.isOnline ? 'Đang hoạt động' : `Hoạt động ${formatTimeTypeAgo(new Date(recipient.recentOnlineTime))}`}
                    </p>

                </div>
            </div>
            <Space wrap>
                <Tooltip title="Thông tin về cuộc trò chuyện">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<MoreOutlined />}
                    ></Button>
                </Tooltip>
            </Space>
        </div>
        <div className="flex flex-col gap-y-3 px-2 py-4 h-full overflow-y-auto scrollbar-w-2 mb-16 scrollbar-h-4 custom-scrollbar">
            {messages.map(msg => <Message key={msg.id} message={msg} isMe={msg.sender.id === senderId || msg.recipient.id === recipient.id} />)}

            <div ref={messagesEndRef}></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-[1px] border-gray-200 bg-white p-2 flex items-center gap-x-2">
            <Input
                placeholder="Soạn tin nhắn..."
                showCount
                value={message.content}
                onChange={(e) => setMessage({
                    ...message,
                    content: e.target.value
                })}
                onKeyDown={handleEnterPress}
            />
            <Tooltip title="Nhấn enter để gửi">
                <Button
                    icon={<SendOutlined />}
                    type="text"
                    size="large"
                    shape="circle"
                    disabled={!message.content}
                    onClick={handleSendMessage}
                >
                </Button>
            </Tooltip>
        </div>
    </div>
};

export default ChatArea;
