import { Button, Form, FormProps, Input, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import { RoleResource } from "../../../../resources";
import roleService from "../../../../services/role-service";
import accountService from "../../../../services/user-service";

type CreateAccountModalProps = {
    handleOk: () => void
}

export type AccountRequest = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleNames: string[];
}

const CreateAccountModal: FC<CreateAccountModalProps> = ({
    handleOk
}) => {

    const [roles, setRoles] = useState<RoleResource[]>([])

    const fetchRoles = async () => {
        const response = await roleService.getAllRoles();
        if (response.success) {
            setRoles(response.data)
        }
    }

    useEffect(() => {
        fetchRoles();
    }, [])

    const onFinish: FormProps<AccountRequest>['onFinish'] = async (values: AccountRequest) => {
        const response = await accountService.createAccount(values);
        if(response.success) {
            message.success(response.message);
            form.resetFields()
            handleOk();
        } else message.error(response.message)
    }

    const [form] = Form.useForm<AccountRequest>()
    return <div className="max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4 px-4">
        <Form
            name="create-account"
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item<AccountRequest>
                label="Họ và tên"
                name='fullName'
                rules={[
                    {
                        required: true,
                        message: 'Họ và tên không được để trống'
                    }
                ]}
            >
                <Input
                    size="large"
                    placeholder="Nhập họ và tên ..."
                />
            </Form.Item>

            <Form.Item<AccountRequest>
                label="Username"
                name='username'
                rules={[
                    {
                        required: true,
                        message: 'Username không được để trống'
                    }
                ]}
            >
                <Input
                    size="large"
                    placeholder="Nhập username ..."
                />
            </Form.Item>

            <Form.Item<AccountRequest>
                label="Địa chỉ email"
                name='email'
                rules={[
                    {
                        required: true,
                        message: "Địa chỉ email không được để trống"
                    },
                    {
                        type: 'email',
                        message: 'Địa chỉ email không hợp lệ'
                    }
                ]}
            >
                <Input placeholder="Nhập địa chỉ email ..." size="large" />
            </Form.Item>

            <Form.Item<AccountRequest>
                label="Cấp quyền"
                name='roleNames'
                rules={[
                    {
                        required: true,
                        message: 'Chưa cấp quyền cho người dùng'
                    },
                ]}
            >
                <Select
                    size="large"
                    mode="multiple"
                    placeholder='Chọn quyền'
                >
                    {roles.map(role => <Select.Option key={role.id} value={role.name}>{role.name}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item<AccountRequest>
                label="Mật khẩu"
                name='password'
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu không được để trống'
                    }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu ..."
                />
            </Form.Item>

            <Form.Item<AccountRequest>
                label="Nhập lại mật khẩu"
                name='confirmPassword'
                rules={[
                    {
                        validator: (_, value) =>
                            form.getFieldValue('password') === value ? Promise.resolve() : Promise.reject('Mật khẩu không khớp')

                    }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu ..."
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>

        </Form>
    </div>
};

export default CreateAccountModal;
