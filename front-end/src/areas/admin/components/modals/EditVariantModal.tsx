import { Button, Form, FormProps, InputNumber, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import { ColorResource, ProductResource, SizeResource, VariantResource } from "../../../../resources";
import productService from "../../../../services/product-service";
import colorService from "../../../../services/color-service";
import sizeService from "../../../../services/size-service";
import variantService from "../../../../services/variant-service";

export type EditVariantRequest = {
    productId?: number;
    colorId?: number;
    sizeId?: number;
    inStock?: number;
};

type EditVariantModalProps = {
    handleOk: () => void;
    variant: VariantResource;
}

const EditVariantModal: FC<EditVariantModalProps> = ({
    handleOk,
    variant
}) => {
    const [products, setProducts] = useState<ProductResource[]>([])
    const [colors, setColors] = useState<ColorResource[]>([])
    const [sizes, setSizes] = useState<SizeResource[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const responseProduct = await productService.getAllProducts();
            setProducts(responseProduct.data)

            const responseColor = await colorService.getAllColors();
            setColors(responseColor.data)

            const responseSize = await sizeService.getAllSizes();
            setSizes(responseSize.data)
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (variant) {
            form.setFieldsValue({
                productId: variant.product.id,
                colorId: variant.color.id,
                sizeId: variant.size.id,
                inStock: variant.inStock
            });
        }
    }, [variant]);

    const [form] = Form.useForm<EditVariantRequest>();

    const onFinish: FormProps<EditVariantRequest>['onFinish'] = async (values): Promise<void> => {
        await variantService.updateVariant(variant.id, values);
        message.success('Cập nhật sản phẩm thành công')
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<EditVariantRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            initialValues={{
                parentCategoryId: 0,
            }}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className="grid grid-cols-2 gap-x-6">
                <Form.Item<EditVariantRequest>
                    label="Sản phẩm"
                    name="productId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn sản phẩm!',
                        },
                        {
                            validator: (_, value) =>
                                value === 0
                                    ? Promise.reject(new Error('Vui lòng chọn sản phẩm!'))
                                    : Promise.resolve(),
                        },
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue={0}
                    >
                        <Select.Option value={0} key={0}>Chọn sản phẩm</Select.Option>
                        {products.map(product => <Select.Option key={product.id} value={product.id}>{product.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item<EditVariantRequest>
                    label="Màu sắc"
                    name="colorId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn màu sắc!',
                        },
                        {
                            validator: (_, value) =>
                                value === 0
                                    ? Promise.reject(new Error('Vui lòng chọn màu sắc!'))
                                    : Promise.resolve(),
                        },
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue={0}
                    >
                        <Select.Option value={0} key={0}>Chọn màu sắc</Select.Option>
                        {colors.map(color => <Select.Option key={color.id} value={color.id}>
                            <div className="flex items-center gap-x-2">
                                <span className="w-5 h-5 rounded-md" style={{
                                    backgroundColor: color.hexCode
                                }}></span>
                                <span>{color.name}</span>
                            </div>
                        </Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item<EditVariantRequest>
                    label="Kích cỡ"
                    name="sizeId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn kích cỡ!',
                        },
                        {
                            validator: (_, value) =>
                                value === 0
                                    ? Promise.reject(new Error('Vui lòng chọn kích cỡ!'))
                                    : Promise.resolve(),
                        },
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue={0}
                    >
                        <Select.Option value={0} key={0}>Chọn kích cỡ</Select.Option>
                        {sizes.map(size => <Select.Option key={size.id} value={size.id}>{size.eSize}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item<EditVariantRequest>
                    label="Tồn kho"
                    name="inStock"
                    rules={[{ required: true, message: 'Tồn kho không được để trống!' }]}
                >
                    <InputNumber style={{ width: '100%' }} size="large" min={0} />
                </Form.Item>
            </div>

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

export default EditVariantModal;