import { Alert, Button, Form, Input, message } from "antd";
import { FormProps, useForm } from "antd/es/form/Form";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import accountService from "../../../services/user-service";
import Loading from "../../shared/Loading";
import CardBorder from "../../admin/components/CardBorder";

export interface ResetPasswordRequest {
    email: string;
    password: string;
    activationToken: string;
}

type ResetPasswordDataForm = {
    password: string;
    passwordConfirm: string;
}

export type ValidateTokenRequest = {
    email: string;
    activationToken: string;
}

const ResetPassword: FC = () => {
    const [form] = useForm<ResetPasswordDataForm>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isValidToken, setIsValidToken] = useState(false)

    useEffect(() => {
        if (!searchParams.get('activationToken') || !searchParams.get('email')) {
            navigate('/not-found')
        } else {
            const payload: ValidateTokenRequest = {
                activationToken: searchParams.get('activationToken')!,
                email: searchParams.get('email')!
            }

            validateToken(payload)
        }
    }, [])

    const validateToken = async (payload: ValidateTokenRequest) => {
        setLoading(true)
        const response = await accountService.validateToken(payload);
        if (response.success) {
            setIsValidToken(true)
        }

        setLoading(false)
    }

    const onFinish: FormProps<ResetPasswordDataForm>['onFinish'] = async (values) => {
        const payload: ResetPasswordRequest = {
            activationToken: searchParams.get('activationToken')!,
            email: searchParams.get('email')!,
            password: values.password
        };

        setLoading(true)
        const response = await accountService.resetPassword(payload);
        if (response.success) {
            message.success(response.message)
            navigate("/")
        }
        else message.error(response.message)
        setLoading(false)
    };

    return <div className="flex h-screen justify-center items-center p-6">
        {isValidToken ? <CardBorder className="p-8 flex flex-col items-center border-2 border-gray-100 rounded-lg w-[500px]">
            <span className="font-semibold text-3xl mb-4">RESET PASSWORD</span>
            <div className="flex justify-center w-full">
                <Form
                    name="basic"
                    form={form}
                    className="w-full"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item<ResetPasswordDataForm>
                        label="Mật khẩu mới"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item<ResetPasswordDataForm>
                        label="Nhập lại mật khẩu mới"
                        name="passwordConfirm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { validator: (_, value) => form.getFieldValue('password') === value ? Promise.resolve() : Promise.reject("Mật khẩu mới không khớp") }
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} size="large" shape="default" className="mt-4 w-full" type="primary" htmlType="submit">
                            Thay đổi
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </CardBorder> : <div>
            <Alert
                message="Không hợp lệ"
                showIcon
                description="Đường dẫn này không hợp lệ hoặc đã hết hiệu lực sử dụng"
                type="error"
                action={
                    <Link to="/">
                        <Button size="small" danger>
                            Trang chủ
                        </Button>
                    </Link>
                }
            />
            {loading && <Loading />}
        </div>}

    </div>
};

export default ResetPassword;
