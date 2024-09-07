import { Button, Form, FormProps, Input, message } from "antd";
import { FC, useEffect } from "react";
import { BrandResource } from "../../../../resources";
import { BrandRequest } from "./CreateBrandModal";
import brandService from "../../../../services/brand-service";


type EditBrandModalProps = {
    handleOk: () => void;
    brand: BrandResource;
}

const EditBrandModal: FC<EditBrandModalProps> = ({
    handleOk,
    brand
}) => {

    useEffect(() => {
        if (brand) {
            form.setFieldsValue({
                name: brand?.name,
                description: brand?.description
            });
        }
    }, [brand]);

    const [form] = Form.useForm<BrandRequest>(); 
    
    const onFinish: FormProps<BrandRequest>['onFinish'] = async (values) : Promise<void> => {
        await brandService.updateBrand(brand.id,  values);
        message.success('Cập nhật nhãn hiệu thành công')
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<BrandRequest>['onFinishFailed'] = (errorInfo) => {
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
            <Form.Item<BrandRequest>
                label="Tên nhãn hiệu"
                name="name"
                rules={[{ required: true, message: 'Tên nhãn hiệu không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên nhãn hiệu ..." />
            </Form.Item>

            <Form.Item<BrandRequest>
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Mô tả nhãn hiệu không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Mô tả ..." />
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

export default EditBrandModal;