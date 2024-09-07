import { Button, ColorPicker, Form, FormProps, Input, message } from "antd";
import { FC } from "react";
import colorService from "../../../../services/color-service";


export type ColorRequest = {
    name?: string;
    hexCode?: string;
};

type CreateColorModalProps = {
    handleOk: () => void;
}

const CreateColorModal: FC<CreateColorModalProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<ColorRequest>(); 

    const onFinish: FormProps<ColorRequest>['onFinish'] = async (values) => {
        const response = await colorService.createColor(values);
        message.success(response.message)
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<ColorRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
                hexCode: '#1677ff'
            }}
        >
            <Form.Item<ColorRequest>
                label="Tên màu sắc"
                name="name"
                rules={[{ required: true, message: 'Tên màu sắc không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên màu sắc ..." />
            </Form.Item>

            <Form.Item<ColorRequest>
                label="Mã màu"
                name="hexCode"
                rules={[{ required: true, message: 'Mã màu không được để trống!' }]}
            >
                <ColorPicker onChange={(value) => {
                        form.setFieldValue('hexCode', value.toHexString());
                    }}  defaultValue="#1677ff" format="hex" size="large" showText />
            </Form.Item>

            <div className="flex justify-end">
                <Form.Item>
                    <Button shape="round" size="large" className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default CreateColorModal;