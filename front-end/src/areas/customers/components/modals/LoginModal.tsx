import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Button, Divider, Form, FormProps, Input, Modal, message } from "antd";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../app/store";
import authService from "../../../../services/auth-service";
import { signIn } from "../../../../feature/auth/authSlice";
import useModal from "../../../../hooks/useModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import deviceTokenService from "../../../../services/device-token-service";


export type SignInRequest = {
    username: string;
    password: string;
}

const onFinishFailed: FormProps<SignInRequest>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};


type LoginModalProps = {
    handleOk: () => void
}


export type GoogleAuthorizeType = {
    accessToken: string;
}

const handleSaveToken = async () => {
    const fcmToken = localStorage.getItem('fcmToken')

    if(fcmToken) {
        await deviceTokenService.saveToken(JSON.parse(fcmToken))
    }
}


const LoginModal: FC<LoginModalProps> = ({
    handleOk
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { handleCancel, handleOk: forgotHandleOk, showModal, isModalOpen } = useModal()

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const payload: GoogleAuthorizeType = {
                accessToken: codeResponse.access_token
            }
            const response = await authService.googleAuthorize(payload);
            if (response.success) {
                message.success(response.message)
                dispatch(signIn(response.data))
                handleSaveToken()
                handleOk()
            } else message.error(response.message)
        },
        onError: (error) => console.log('Login Failed:', error),
        prompt: 'consent',
    });


    const onFinish: FormProps<SignInRequest>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const response = await authService.signIn(values);
        if (response.success) {
            message.success(response.message)
            dispatch(signIn(response.data))
            handleSaveToken()
            handleOk()
        } else message.error(response.message)
    };


    return <div className="px-10">
        <p className="text-2xl font-bold my-4">ĐĂNG NHẬP ĐỂ TIẾP TỤC NÀO!</p>
        <Form
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<SignInRequest>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input size="large" />
            </Form.Item>

            <Form.Item<SignInRequest>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
                <Button shape="round" size="large" className="mt-4 w-full" type="primary" htmlType="submit">
                    Đăng nhập
                </Button>
                <button onClick={showModal} className="mt-1 px-3 font-semibold underline" type="button">Quên mật khẩu?</button>
            </Form.Item>
        </Form>

        <Divider plain>Hoặc tiếp tục với</Divider>
        <div className="flex gap-x-4 items-center">
            <button onClick={() => login()} className="flex-1 flex gap-x-2 items-center bg-red-500 px-5 py-2 rounded-sm text-white">
                <FontAwesomeIcon icon={faGoogle} />
                <span>Google</span>
            </button>
            <FacebookLogin
                appId="467458189525621"
                style={{
                    backgroundColor: '#4267b2',
                    color: '#fff',
                    fontSize: '16px',
                    padding: '7px 24px',
                    border: 'none',
                    borderRadius: '2px',
                }}
            />

        </div>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            footer={[]}
        >
            <ForgotPasswordModal />
        </Modal>

    </div>;
};

export default LoginModal;
