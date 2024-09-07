import { Button, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC } from "react";
import authService from "../../../../services/auth-service";

export interface SignUpRequest {
    fullName: string;
    phoneNumber: string;
    username: string;
    email: string;
    password: string;
}

interface SignUpDataForm extends SignUpRequest {
    confirmPassword: string;
}

type RegisterModalProps = {
    handleOk: () => void
}

const RegisterModal: FC<RegisterModalProps> = ({
    handleOk
}) => {

    const [form] = useForm<SignUpDataForm>();

    const onFinish: FormProps<SignUpDataForm>['onFinish'] = async (values) => {

        const response = await authService.signUp(values as SignUpRequest)
        if (response.success) {
            message.success(response.message)
            handleOk()
        } else message.error(response.message)


    };


    return <div className="px-10">
        <p className="text-2xl font-bold my-4">TẠO TÀI KHOẢN MỚI NÀO!</p>
        <Form
            name="basic"
            form={form}
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <div className="grid grid-cols-2 gap-x-6">
                <Form.Item<SignUpDataForm>
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input size="large" placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item<SignUpDataForm>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                >
                    <Input size="large" placeholder="Nhập username" />
                </Form.Item>

                <Form.Item<SignUpDataForm>
                    label="Địa chỉ email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        {
                            type: 'email',
                            message: 'Email không hợp lệ',
                        },
                    ]}
                >
                    <Input size="large" placeholder="Nhập địa chỉ email" />
                </Form.Item>

                <Form.Item<SignUpDataForm>
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input size="large" placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item<SignUpDataForm>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item<SignUpDataForm>
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                        { validator: (_, value) => value === form.getFieldValue('password') ? Promise.resolve() : Promise.reject('Mật khẩu không khớp!') },
                    ]}
                >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button shape="round" size="large" className="mt-4 w-full" type="primary" htmlType="submit">
                        Đăng kí
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default RegisterModal;
