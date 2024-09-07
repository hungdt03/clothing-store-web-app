import { Button, Form, FormProps, Input, InputNumber, message } from "antd";
import { FC, useEffect } from "react";
import { SizeResource } from "../../../../resources";
import { SizeRequest } from "./CreateSizeModal";
import sizeService from "../../../../services/size-service";


type EditSizeModalProps = {
    handleOk: () => void;
    size: SizeResource;
}

const EditSizeModal: FC<EditSizeModalProps> = ({
    handleOk,
    size
}) => {

    useEffect(() => {
        if (size) {
            form.setFieldsValue({
                eSize: size?.eSize,
                minHeight: size?.minHeight,
                maxHeight: size?.maxHeight,
                minWeight: size?.minWeight,
                maxWeight: size?.maxWeight,
            });
        }
    }, [size]);

    const [form] = Form.useForm<SizeRequest>();

    const onFinish: FormProps<SizeRequest>['onFinish'] = async (values): Promise<void> => {
        await sizeService.updateSize(size.id, values);
        message.success('Cập nhật kích cỡ thành công')
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
                <InputNumber size="large" style={{ width: '100%' }} min={10} max={300} defaultValue={1} />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Chiều cao tối đa"
                name="maxHeight"
                rules={[{ required: true, message: 'Chiều cao tối đa không được để trống!' }]}
            >
                <InputNumber size="large" style={{ width: '100%' }} min={10} max={300} defaultValue={1} />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Cân nặng tối thiểu"
                name="minWeight"
                rules={[{ required: true, message: 'Cân nặng tối thiểu không được để trống!' }]}
            >
                <InputNumber size="large" style={{ width: '100%' }} min={30} max={100} defaultValue={30} />
            </Form.Item>

            <Form.Item<SizeRequest>
                label="Cân nặng tối đa"
                name="maxWeight"
                rules={[{ required: true, message: 'Cân nặng tối đa không được để trống!' }]}
            >
                <InputNumber size="large" style={{ width: '100%' }} min={30} max={200} defaultValue={30} />
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

export default EditSizeModal;