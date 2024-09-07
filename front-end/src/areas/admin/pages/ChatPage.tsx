import { FC, useEffect, useState } from "react";
import ChatArea from "../components/ChatArea";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../feature/auth/authSlice";
import { UserContactResource, UserResource } from "../../../resources";
import accountService from "../../../services/user-service";
import { Divider, Empty, Flex, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import ChatUserItem from "../components/ChatUserItem";

const { Title } = Typography

const ChatPage: FC = () => {
    const [recipient, setRecipient] = useState<UserResource | null>(null)
    const { user } = useSelector(selectAuth)
    const [users, setUsers] = useState<UserContactResource[]>([])

    const fetchUsers = async () => {
        const response = await accountService.getAllExceptLoggedInUser();
        console.log(response)
        setUsers(response.data);
    }

    useEffect(() => {
        fetchUsers();
    }, [])


    return <div className="grid grid-cols-12 gap-x-6 h-full">
        <div className="col-span-8 overflow-y-auto">
            {recipient && user && <ChatArea recipient={recipient} senderId={user.id} />}
            {!recipient && <div className="flex items-center justify-center h-full">
                <Empty description="Chọn đoạn hội thoại để bắt đầu" />
            </div>}
        </div>
        <div className="col-span-4 h-full overflow-y-hidden">
            <div className="z-10 bg-white p-4">
                <Title level={4}>Đoạn chat</Title>
                <Input placeholder="Nhập từ khóa tìm kiếm" prefix={<SearchOutlined />} />
            </div>
            <Divider className="m-0" />
            <Flex className="bg-white h-[85%] overflow-y-auto scrollbar-w-2 scrollbar-h-4 custom-scrollbar p-4" vertical gap={12}>
                {users?.map(group => <ChatUserItem onClick={() => setRecipient(group.user)} key={group.user.id} group={group} />)}
            </Flex>
        </div>
    </div>
};

export default ChatPage;
