import { Button, Form, FormProps, GetProp, Image, Input, InputNumber, Select, Tooltip, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import brandService from "../../../../services/brand-service";
import Dragger from "antd/es/upload/Dragger";
import { BrandResource, CategoryResource } from "../../../../resources";
import categoryService from "../../../../services/category-service";
import productService from "../../../../services/product-service";
import Loading from "../../../shared/Loading";
import { getBase64 } from "../../../../utils/file";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type ProductRequest = {
    name: string;
    description: string;
    thumbnail: UploadFile[];
    zoomImage: UploadFile[];
    oldPrice: number;
    price: number;
    brandId: number;
    categoryId: number;
    otherImages?: UploadFile[]
};

type CreateProductModalProps = {
    handleOk: () => void;
}


const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);

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

        setLoading(true)
        const response = await productService.createProduct(formData);
        message.success(response.message)
        resetForm();
        handleOk()
        setLoading(false)
    };

    const resetForm = () => {
        form.resetFields();
        setFileOtherImagesList([])
        setFileThumbnail([])
        setFileZoomImage([])
    }

    const onFinishFailed: FormProps<ProductRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [fileOtherImagesList, setFileOtherImagesList] = useState<any[]>([]);
    const [fileThumbnail, setFileThumbnail] = useState<UploadFile[]>([]);

    const [fileZoomImage, setFileZoomImage] = useState<UploadFile[]>([]);

    const [previewThumbnailOpen, setPreviewThumbnailOpen] = useState(false);
    const [previewThumbnailImage, setPreviewThumbnailImage] = useState('');

    const [previewZoomImageOpen, setPreviewZoomImageOpen] = useState(false);
    const [previewZoomImageImage, setPreviewZoomImageImage] = useState('');

    const [previewOtherImagesOpen, setPreviewOtherImagesOpen] = useState(false);
    const [previewOtherImagesImage, setPreviewOtherImagesImage] = useState('');


    const handleThumbnailPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewThumbnailImage(file.url ?? (file.preview as string));
        setPreviewThumbnailOpen(true);
    };

    const handleZoomImagePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewZoomImageImage(file.url ?? (file.preview as string));
        setPreviewZoomImageOpen(true);
    };


    const handleOtherImagesPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewOtherImagesImage(file.url ?? (file.preview as string));
        setPreviewOtherImagesOpen(true);
    };

    const handleThumbnailChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        form.setFieldValue('thumbnail', newFileList)
        setFileThumbnail(newFileList);
    }

    const handleZoomImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        form.setFieldValue('zoomImage', newFileList)
        setFileZoomImage(newFileList);
    }

    const handleOtherImagesChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {

        form.setFieldValue('otherImages', newFileList);
        setFileOtherImagesList(newFileList)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            form.setFieldValue('otherImages', info.fileList);
            setFileOtherImagesList(info.fileList)
        },
        beforeUpload(_) {
            return false;
        }
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            initialValues={{
                oldPrice: 100000,
                price: 100000
            }}
            autoComplete="off"
        >
            <div className="grid grid-cols-12 gap-x-8">
                <div className="col-span-5 gap-y-4 flex flex-col">
                    <Form.Item<ProductRequest>
                        label="Ảnh đại diện"
                        name="thumbnail"
                        rules={[{ required: true, message: 'Ảnh sản phẩm không được để trống!' }]}
                    >
                        <Upload
                            listType="picture-circle"
                            fileList={fileThumbnail}
                            onPreview={handleThumbnailPreview}
                            onChange={handleThumbnailChange}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            {fileThumbnail.length > 0 ? null : uploadButton}
                        </Upload>
                        {previewThumbnailImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewThumbnailOpen,
                                    onVisibleChange: (visible) => setPreviewThumbnailOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewThumbnailImage(''),
                                }}
                                src={previewThumbnailImage}
                            />
                        )}
                    </Form.Item>
                    <Form.Item<ProductRequest>
                        label="Ảnh phóng to"
                        className="text-center"
                        name="zoomImage"
                        rules={[{ required: true, message: 'Ảnh phóng to sản phẩm không được để trống!' }]}
                    >
                        <Upload
                            listType="picture-circle"
                            fileList={fileZoomImage}
                            onPreview={handleZoomImagePreview}
                            onChange={handleZoomImageChange}
                            beforeUpload={() => false}
                        >
                            {fileZoomImage.length >= 1 ? null : uploadButton}
                        </Upload>
                        {previewZoomImageImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewZoomImageOpen,
                                    onVisibleChange: (visible) => setPreviewZoomImageOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewZoomImageImage(''),
                                }}
                                src={previewZoomImageImage}
                            />
                        )}
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Các ảnh khác"
                        name="otherImages"
                    >
                        <>
                            {fileOtherImagesList.length === 0 ? (

                                <Dragger {...props} style={{ marginBottom: '20px' }}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Thêm ảnh</p>
                                    <p className="ant-upload-hint">
                                        Ấn hoặc kéo thả ảnh vào khu vực này
                                    </p>
                                </Dragger>
                            ) : (
                                <div className="mb-4">
                                    <Upload
                                        beforeUpload={() => false}
                                        listType="picture-card"
                                        fileList={fileOtherImagesList}
                                        onPreview={handleOtherImagesPreview}
                                        onChange={handleOtherImagesChange}
                                    >
                                        {fileOtherImagesList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                    {previewOtherImagesImage && (
                                        <Image
                                            wrapperStyle={{ display: 'none' }}
                                            preview={{
                                                visible: previewOtherImagesOpen,
                                                onVisibleChange: (visible) => setPreviewOtherImagesOpen(visible),
                                                afterOpenChange: (visible) => !visible && setPreviewOtherImagesImage(''),
                                            }}
                                            src={previewOtherImagesImage}
                                        />
                                    )}
                                </div>
                            )}
                        </>
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
                        label="Giá cũ"
                        name="oldPrice"
                        rules={[{ required: true, message: 'Giá cũ không được để trống!' }]}
                    >
                        <InputNumber size="large" style={{ width: '100%' }} defaultValue={100000} />
                    </Form.Item>

                    <Form.Item<ProductRequest>
                        label="Giá hiện tại"
                        name="price"
                        rules={[{ required: true, message: 'Giá hiện tại sản phẩm không được để trống!' }]}
                    >
                        <InputNumber size="large" style={{ width: '100%' }} defaultValue={100000} />
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