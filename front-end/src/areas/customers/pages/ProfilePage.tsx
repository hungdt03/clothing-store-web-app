import { Avatar, Button, Form, FormProps, Input, Tabs, TabsProps, Tag, Tooltip, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import CardBorder from "../../admin/components/CardBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setUserDetails } from "../../../feature/auth/authSlice";
import { useForm } from "antd/es/form/Form";
import accountService from "../../../services/user-service";
import { AppDispatch } from "../../../app/store";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import Loading from "../../shared/Loading";

export type ProfileRequest = {
    fullName?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
};

const PersonalProfile: FC = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector(selectAuth)
    const [form] = useForm<ProfileRequest>()

    const handleResetFormDefault = () => {
        form.setFieldsValue({
            email: user?.email,
            fullName: user?.name,
            phoneNumber: user?.phoneNumber,
            username: user?.username,
        })
    }

    useEffect(() => {
        handleResetFormDefault()
    }, [dispatch])

    const onFinish: FormProps<ProfileRequest>['onFinish'] = async (values) => {
        const response = await accountService.updateProfile(values);
        if (response.success) {
            dispatch(setUserDetails(response.data))
            message.success(response.message)
        } else message.error(response.message)
    };

    return <div className="flex items-start justify-end gap-x-6">
        <CardBorder className="flex-1 border-[1px] border-gray-200">
            <Form
                name="basic"
                onFinish={onFinish}
                form={form}
                initialValues={{
                    email: user?.email,
                    fullName: user?.name,
                    phoneNumber: user?.phoneNumber,
                    username: user?.username,
                }}
                layout="vertical"
                autoComplete="off"

            >
                <div className="grid grid-cols-2 gap-x-6">
                    <Form.Item<ProfileRequest>
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên" size="large" />
                    </Form.Item>

                    <Form.Item<ProfileRequest>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                    >
                        <Input placeholder="Nhập username" size="large" />
                    </Form.Item>
                    <Form.Item<ProfileRequest>
                        label="Địa chỉ email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input placeholder="Nhập địa chỉ email" size="large" />
                    </Form.Item>
                    <Form.Item<ProfileRequest>
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" size="large" />
                    </Form.Item>
                </div>

                <div className="flex gap-x-3 justify-end">
                    <Button size="large" onClick={handleResetFormDefault} type="default" >
                        Reset
                    </Button>
                    <Form.Item>
                        <Button size="large" type="primary" htmlType="submit">
                            Lưu lại
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </CardBorder>
    </div>
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

interface ChangePasswordDataForm extends ChangePasswordRequest {
    newPasswordConfirm: string;
}

const ChangePasswordTab: FC = () => {
    const [form] = useForm<ChangePasswordDataForm>()

    const onFinish: FormProps<ChangePasswordDataForm>['onFinish'] = async (values) => {
        const response = await accountService.changePassword(values as ChangePasswordRequest);
        if (response.success) {
            message.success(response.message)
            form.resetFields()
        }
        else message.error(response.message)

    };


    return <div className="p-6">
        <Form
            name="basic"
            form={form}
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <div className="grid grid-cols-2 gap-x-6">
                <Form.Item<ChangePasswordDataForm>
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu cũ" />
                </Form.Item>

                <Form.Item<ChangePasswordDataForm>
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
                </Form.Item>

                <Form.Item<ChangePasswordDataForm>
                    label="Nhập lại mật khẩu mới"
                    name="newPasswordConfirm"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { validator: (_, value) => form.getFieldValue('newPassword') === value ? Promise.resolve() : Promise.reject("Mật khẩu mới không khớp") }
                    ]}
                >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
            </div>

            <Form.Item className="flex justify-start">
                <Button shape="default" size="large" className="mt-4 w-full" type="primary" htmlType="submit">
                    Lưu lại thay đổi
                </Button>
            </Form.Item>
        </Form>
    </div>
};




const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Thông tin cơ bản',
        children: <PersonalProfile />,
    },
    {
        key: '2',
        label: 'Thay đổi mật khẩu',
        children: <ChangePasswordTab />,
    }

];


const ProfilePage: FC = () => {
    const { user } = useSelector(selectAuth)
    const dispatch = useDispatch<AppDispatch>()

    const [loading, setLoading] = useState(false)

    const handleUploadCoverImage = async (file: string | RcFile | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        const response = await accountService.uploadCoverImage(formData);
        if (response.success) {
            dispatch(setUserDetails(response.data))
            message.success(response.message)
        } else message.error(response.message)
        setLoading(false)
    }


    const coverImageProps: UploadProps = {
        name: 'coverImage',
        showUploadList: false,
        customRequest: ({ file }) => {
            handleUploadCoverImage(file)
        }
    };

    const handleUploadAvatar = async (file: string | RcFile | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        const response = await accountService.uploadAvatar(formData);
        if (response.success) {
            dispatch(setUserDetails(response.data))
            message.success(response.message)
        } else message.error(response.message)
        setLoading(false)
    }


    const avatarImageProps: UploadProps = {
        name: 'avatarImage',
        showUploadList: false,
        customRequest: ({ file }) => {
            handleUploadAvatar(file)
        }
    };

    return <div className="py-6">
        {loading && <Loading />}
        <div className="relative mb-40">
            <div className="relative">
                <img className="w-full h-[250px] object-cover rounded-xl" src={user?.coverImage ?? images.demoMenth} />
                <Tooltip title="Upload ảnh bìa">
                    <span className="absolute right-4 bottom-4 shadow-xl cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-white">
                        <ImgCrop modalTitle="Upload ảnh bìa" modalCancel="Hủy bỏ" modalOk="Lưu lại" rotationSlider>
                            <Upload
                                {...coverImageProps}
                            >
                                <FontAwesomeIcon icon={faCamera} />
                            </Upload>
                        </ImgCrop>

                    </span>
                </Tooltip>
            </div>

            <div style={{
                top: 'calc(100% - 20px)'
            }} className="absolute flex left-14 items-center gap-x-3">
                <div className="relative">
                    <Avatar className="w-40 h-40 border-2 border-white" size='large' shape="circle" src={user?.avatar ?? images.demoMenth} />

                    <Tooltip title="Upload ảnh đại diện">
                        <span className="absolute right-4 bottom-0 shadow-xl cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-white">
                            <ImgCrop modalTitle="Upload ảnh đại diện" modalCancel="Hủy bỏ" modalOk="Lưu lại" rotationSlider>
                                <Upload
                                    {...avatarImageProps}
                                >
                                    <FontAwesomeIcon icon={faCamera} />
                                </Upload>
                            </ImgCrop>

                        </span>
                    </Tooltip>
                </div>
                <div className="flex flex-col gap-y-2 items-start">
                    <p className="text-xl font-semibold">{user?.name}</p>
                    <div className="flex gap-x-1">
                        <Tag color="green" className="text-[13px]">Khách hàng</Tag>
                        {user?.roles.includes('ADMIN') && <Tag color="blue" className="text-[13px]">Quản trị viên</Tag>}
                    </div>
                </div>
            </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
    </div>
};

export default ProfilePage;
