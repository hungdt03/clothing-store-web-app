import { Button, Form, FormProps, Input, InputNumber, message } from "antd";
import { FC } from "react";
import sizeService from "../../../../services/size-service";


export type SizeRequest = {
    eSize: string;
    minWeight: number;
    maxWeight: number;
    minHeight: number;
    maxHeight: number;
};

type CreateSizeModalProps = {
    handleOk: () => void;
}

const CreateSizeModal: FC<CreateSizeModalProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<SizeRequest>(); 

    const onFinish: FormProps<SizeRequest>['onFinish'] = async (values) => {
        const response = await sizeService.createSize(values);
        message.success(response.message)
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<SizeRequest>['onFinishFailed'] = (errorInfo) => {
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
                minWeight: 30,
                maxWeight: 30,
                minHeight: 1.0,
                maxHeight: 1.0
            }}
        >
            <Form.Item<SizeRequest>
                label="Tên kích cỡ"
                name="eSize"
                rules={[{ required: true, message: 'Tên kích cỡ không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên kích cỡ ..." />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Chiều cao tối thiểu"
                name="minHeight"
                rules={[{ required: true, message: 'Chiều cao tối thiểu không được để trống!' }]}
            >
                 <InputNumber size="large" style={{ width: '100%' }} min={10} max={300} defaultValue={1}  />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Chiều cao tối đa"
                name="maxHeight"
                rules={[{ required: true, message: 'Chiều cao tối đa không được để trống!' }]}
            >
                 <InputNumber size="large" style={{ width: '100%' }} min={10} max={300} defaultValue={1}  />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Cân nặng tối thiểu"
                name="minWeight"
                rules={[{ required: true, message: 'Cân nặng tối thiểu không được để trống!' }]}
            >
                 <InputNumber size="large" style={{ width: '100%' }} min={30} max={100} defaultValue={30}  />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Cân nặng tối đa"
                name="maxWeight"
                rules={[{ required: true, message: 'Cân nặng tối đa không được để trống!' }]}
            >
                 <InputNumber size="large" style={{ width: '100%' }} min={30} max={200} defaultValue={30}  />
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

export default CreateSizeModal;