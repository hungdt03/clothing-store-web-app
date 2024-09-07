import { Button, Form, FormProps, Input, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import roleService from "../../../../services/role-service";
import { RoleResource, UserResource } from "../../../../resources";
import accountService from "../../../../services/user-service";

type EditAccountModalProps = {
    handleOk: () => void;
    user: UserResource
}

export type EditAccountRequest = {
    // fullName: string;
    // username: string;
    // email: string;
    // oldPassword: string;
    // newPassword: string;
    // confirmPassword: string;
    roleNames: string[];
}

const EditAccountModal: FC<EditAccountModalProps> = ({
    handleOk,
    user
}) => {
    const [roles, setRoles] = useState<RoleResource[]>([])

    const fetchRoles = async () => {
        const response = await roleService.getAllRoles();
        if (response.success) {
            setRoles(response.data)
        }
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                // fullName: user.name,
                // email: user.email,
                // username: user.username,
                roleNames: user.roles
            });
        }
    }, [user]);

    useEffect(() => {
        fetchRoles();
    }, [])

    const onFinish: FormProps<EditAccountRequest>['onFinish'] = async (values: EditAccountRequest) => {
        const isFailure = await accountService.editAccount(user.id, values);
        if (isFailure) {
            message.error(isFailure.message)
        } else {
            message.success('Cập nhật thông tin tài khoản thành công');
            form.resetFields()
            handleOk();
        }
    }

    const [form] = Form.useForm<EditAccountRequest>()

    return <div className="max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4 px-4">
        <Form
            name="create-account"
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            {/* <Form.Item<EditAccountRequest>
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

            <Form.Item<EditAccountRequest>
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

            <Form.Item<EditAccountRequest>
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
            </Form.Item> */}

            <Form.Item<EditAccountRequest>
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

            {/* <Form.Item<EditAccountRequest>
                label="Mật khẩu"
                name='oldPassword'
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu cũ không được để trống'
                    }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu cũ..."
                />
            </Form.Item>

            <Form.Item<EditAccountRequest>
                label="Mật khẩu mới"
                name='newPassword'
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu mới không được để trống'
                    },
                    {
                        validator: (_, value) =>
                            form.getFieldValue('oldPassword') !== value ? Promise.resolve() : Promise.reject('Mật khẩu cũ và mới không được giống nhau')

                    }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu ..."
                />
            </Form.Item>

            <Form.Item<EditAccountRequest>
                label="Nhập lại mật khẩu"
                name='confirmPassword'
                rules={[
                    {
                        validator: (_, value) =>
                            form.getFieldValue('newPassword') === value ? Promise.resolve() : Promise.reject('Mật khẩu không khớp')

                    }
                ]}
            >
                <Input.Password
                    size="large"
                    placeholder="Nhập mật khẩu ..."
                />
            </Form.Item> */}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>

        </Form>
    </div>
};

export default EditAccountModal;
