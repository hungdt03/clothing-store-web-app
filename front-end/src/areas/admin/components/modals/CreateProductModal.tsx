import { Button, Form, FormProps, GetProp, Input, InputNumber, Select, UploadFile, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import brandService from "../../../../services/brand-service";
import { BrandResource, CategoryResource } from "../../../../resources";
import categoryService from "../../../../services/category-service";
import productService from "../../../../services/product-service";
import Loading from "../../../shared/Loading";
import UploadSingleFile from "../uploads/UploadSingleFile";
import UploadMultipleFile from "../uploads/UploadMultiFile";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type ProductRequest = {
    name: string;
    description: string;
    thumbnail: UploadFile[];
    zoomImage: UploadFile[];
    oldPrice: number;
    price: number;
    purchasePrice: number;
    brandId: number;
    categoryId: number;
    otherImages?: UploadFile[]
};

type CreateProductModalProps = {
    handleOk: () => void;
}


const CreateProductModal: FC<CreateProductModalProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<ProductRequest>();
    const [categories, setCategories] = useState<CategoryResource[]>([])
    const [brands, setBrands] = useState<BrandResource[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const responseCategory = await categoryService.getAllCategories();
            setCategories(responseCategory.data)

            const responseBrand = await brandService.getAllBrands();
            setBrands(responseBrand.data)
        }

        fetchData();
    }, [])

    const onFinish: FormProps<ProductRequest>['onFinish'] = async (values) => {
        const formData = new FormData();

        values.thumbnail.forEach(file => {
            if (file.originFileObj) {
                formData.append('thumbnail', file.originFileObj, file.name);
            }
        });

        values.zoomImage.forEach(file => {
            if (file.originFileObj) {
                formData.append('zoomImage', file.originFileObj, file.name);
            }
        });

        values?.otherImages?.forEach(file => {
            if (file.originFileObj) {
                formData.append('otherImages', file.originFileObj, file.name);
            }
        })

        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("categoryId", String(values.categoryId));
        formData.append("brandId", String(values.brandId));
        formData.append("oldPrice", String(values.oldPrice));
        formData.append("price", String(values.price));
        formData.append("purchasePrice", String(values.purchasePrice));

        setLoading(true)
        const response = await productService.createProduct(formData);
        message.success(response.message)
        resetForm();
        handleOk()
        setLoading(false)
    };

    const resetForm = () => {
        form.resetFields();
    }

    const onFinishFailed: FormProps<ProductRequest>['onFinishFailed'] = (errorInfo) => {
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
            <div className="grid grid-cols-12 gap-x-8">
                <div className="col-span-5 gap-y-4 flex flex-col">
                    <Form.Item<ProductRequest>
                        label="Ảnh đại diện"
                        name="thumbnail"
                        rules={[{ required: true, message: 'Ảnh sản phẩm không được để trống!' }]}
                    >
                        <UploadSingleFile
                            onChange={(fileList) => form.setFieldValue('thumbnail', fileList)}
                            valueUrl=""
                        />
                    </Form.Item>
                    <Form.Item<ProductRequest>
                        label="Ảnh phóng to"
                        className="text-center"
                        name="zoomImage"
                        rules={[{ required: true, message: 'Ảnh phóng to sản phẩm không được để trống!' }]}
                    >
                        <UploadSingleFile
                            onChange={(fileList) => form.setFieldValue('zoomImage', fileList)}
                            valueUrl=""
                        />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Các ảnh khác"
                        name="otherImages"
                    >
                        <UploadMultipleFile
                            onChange={(fileList) => form.setFieldValue('otherImages', fileList)}
                        />
                    </Form.Item>
                </div>
                <div className="col-span-7">
                    <Form.Item<ProductRequest>
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
                    <Form.Item<ProductRequest>
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
                    <Form.Item<ProductRequest>
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Tên sản phẩm không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Tên sản phẩm ..." />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Mô tả sản phẩm không được để trống!' }]}
                    >
                        <Input.TextArea size="large" placeholder="Mô tả ..." />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Giá nhập"
                        name="purchasePrice"
                        rules={[{ required: true, message: 'Giá nhập không được để trống!' }]}
                    >
                        <InputNumber placeholder="Giá nhập" size="large" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Giá cũ"
                        name="oldPrice"
                        rules={[{ required: true, message: 'Giá cũ không được để trống!' }]}
                    >
                        <InputNumber placeholder="Giá cũ" size="large" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Giá hiện tại"
                        name="price"
                        rules={[{ required: true, message: 'Giá hiện tại sản phẩm không được để trống!' }]}
                    >
                        <InputNumber placeholder="Giá hiện tại" size="large" style={{ width: '100%' }} />
                    </Form.Item>
                </div>
            </div>



            <div className="flex justify-end">
                <Form.Item>
                    <Button shape="round" size="large" className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>

        {loading && <Loading />}
    </div>
};

export default CreateProductModal;