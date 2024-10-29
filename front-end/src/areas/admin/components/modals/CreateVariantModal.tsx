import { Button, Form, FormProps, GetProp, Image, InputNumber, Select, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";
import {  ColorResource, ProductResource, SizeResource } from "../../../../resources";
import productService from "../../../../services/product-service";
import Loading from "../../../shared/Loading";
import variantService from "../../../../services/variant-service";
import colorService from "../../../../services/color-service";
import sizeService from "../../../../services/size-service";
import { getBase64 } from "../../../../utils/file";
import UploadButton from "../UploadButton";


export type VariantRequest = {
    thumbnailUrl: UploadFile[];
    inStock: number;
    productId: number;
    colorId: number;
    sizeId: number;
    images: UploadFile[]
};

type CreateVariantModalProps = {
    handleOk: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const CreateVariantModal: FC<CreateVariantModalProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<VariantRequest>();
    const [products, setProducts] = useState<ProductResource[]>([])
    const [colors, setColors] = useState<ColorResource[]>([])
    const [sizes, setSizes] = useState<SizeResource[]>([])
    const [loading, setLoading] = useState(false)

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

    const onFinish: FormProps<VariantRequest>['onFinish'] = async (values) => {
        const formData = new FormData();

        values.thumbnailUrl.forEach(file => {
            if (file.originFileObj) {
                formData.append('thumbnailUrl', file.originFileObj, file.name);
            }
        });

        if(values.images) {
            values.images.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj, file.name);
                }
            })
        }

        formData.append("inStock", values.inStock.toString());
        formData.append("sizeId", values.sizeId.toString());
        formData.append("productId", values.productId.toString());
        formData.append("colorId", values.colorId.toString());

        setLoading(true)
        const response = await variantService.createVariant(formData);
        console.log(response)
        message.success(response.message)
        resetForm();
        handleOk()
        setLoading(false)
    };

    const resetForm = () => {
        form.resetFields();
        setFileOtherImagesList([])
        setFileThumbnail([])
    }

    const onFinishFailed: FormProps<VariantRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [fileOtherImagesList, setFileOtherImagesList] = useState<any[]>([]);
    const [fileThumbnail, setFileThumbnail] = useState<UploadFile[]>([]);

    const [previewThumbnailOpen, setPreviewThumbnailOpen] = useState(false);
    const [previewThumbnailImage, setPreviewThumbnailImage] = useState('');

    const [previewOtherImagesOpen, setPreviewOtherImagesOpen] = useState(false);
    const [previewOtherImagesImage, setPreviewOtherImagesImage] = useState('');


    const handleThumbnailPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewThumbnailImage(file.url ?? (file.preview as string));
        setPreviewThumbnailOpen(true);
    };

    const handleOtherImagesPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewOtherImagesImage(file.url ?? (file.preview as string));
        setPreviewOtherImagesOpen(true);
    };

    const handleThumbnailChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        form.setFieldValue('thumbnailUrl', newFileList)
        setFileThumbnail(newFileList);
    }

    const handleOtherImagesChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {

        form.setFieldValue('images', newFileList);
        setFileOtherImagesList(newFileList)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            form.setFieldValue('images', info.fileList);
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
                    <Form.Item<VariantRequest>
                        label="Ảnh đại diện"
                        name="thumbnailUrl"
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
                            {fileThumbnail.length > 0 ? null : <UploadButton />}
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
                  

                    <Form.Item<VariantRequest>
                        label="Các ảnh khác"
                        name="images"
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
                                        {fileOtherImagesList.length >= 8 ? null : <UploadButton />}
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
                    <Form.Item<VariantRequest>
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
                    <Form.Item<VariantRequest>
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
                    <Form.Item<VariantRequest>
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
                    <Form.Item<VariantRequest>
                        label="Tồn kho"
                        name="inStock"
                        rules={[{ required: true, message: 'Tồn kho không được để trống!' }]}
                    >
                        <InputNumber style={{ width: '100%'}} size="large" min={0} />
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

export default CreateVariantModal;