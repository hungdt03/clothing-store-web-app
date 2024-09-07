import { Button, Form, FormProps, Input, InputNumber, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import { BrandResource, CategoryResource, ProductResource } from "../../../../resources";
import categoryService from "../../../../services/category-service";
import brandService from "../../../../services/brand-service";
import productService from "../../../../services/product-service";

export type EditProductRequest = {
    name?: string;
    description?: string;
    categoryId?: number;
    brandId?: number;
    oldPrice?: number;
    price?: number;
};

type EditProductModalProps = {
    handleOk: () => void;
    product: ProductResource;
}

const EditProductModal: FC<EditProductModalProps> = ({
    handleOk,
    product
}) => {
    const [categories, setCategories] = useState<CategoryResource[]>([])
    const [brands, setBrands] = useState<BrandResource[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const responseCategory = await categoryService.getAllCategories();
            setCategories(responseCategory.data)

            const responseBrand = await brandService.getAllBrands();
            setBrands(responseBrand.data)
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                categoryId: product.category.id,
                brandId: product.brand.id,
                name: product.name,
                description: product.description,
                oldPrice: product.oldPrice,
                price: product.price,
            });
        }
    }, [product]);

    const [form] = Form.useForm<EditProductRequest>();

    const onFinish: FormProps<EditProductRequest>['onFinish'] = async (values): Promise<void> => {
        await productService.updateProduct(product.id, values);
        message.success('Cập nhật sản phẩm thành công')
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<EditProductRequest>['onFinishFailed'] = (errorInfo) => {
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
                <Form.Item<EditProductRequest>
                    label="Danh mục"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn danh mục!',
                        },
                        {
                            validator: (_, value) =>
                                value === 0
                                    ? Promise.reject(new Error('Vui lòng chọn danh mục!'))
                                    : Promise.resolve(),
                        },
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue={0}
                    >
                        <Select.Option value={0} key={0}>Chọn danh mục</Select.Option>
                        {categories.map(category => <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item<EditProductRequest>
                    label="Nhãn hiệu"
                    name="brandId"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn nhãn hiệu!',
                        },
                        {
                            validator: (_, value) =>
                                value === 0
                                    ? Promise.reject(new Error('Vui lòng chọn nhãn hiệu!'))
                                    : Promise.resolve(),
                        },
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue={0}
                    >
                        <Select.Option value={0} key={0}>Chọn nhãn hiệu</Select.Option>
                        {brands.map(brand => <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item<EditProductRequest>
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Tên sản phẩm không được để trống!' }]}
                >
                    <Input size="large" placeholder="Tên sản phẩm ..." />
                </Form.Item>

                <Form.Item<EditProductRequest>
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Mô tả sản phẩm không được để trống!' }]}
                >
                    <Input.TextArea size="large" placeholder="Mô tả ..." />
                </Form.Item>



                <Form.Item<EditProductRequest>
                    label="Giá cũ"
                    name="oldPrice"
                    rules={[{ required: true, message: 'Giá cũ không được để trống!' }]}
                >
                    <InputNumber size="large" style={{ width: '100%' }} defaultValue={100000} />
                </Form.Item>

                <Form.Item<EditProductRequest>
                    label="Giá hiện tại"
                    name="price"
                    rules={[{ required: true, message: 'Giá hiện tại sản phẩm không được để trống!' }]}
                >
                    <InputNumber size="large" style={{ width: '100%' }} defaultValue={100000} />
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

export default EditProductModal;