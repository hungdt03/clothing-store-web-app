import { Button, Checkbox, Empty, GetProp, Image, Modal, Rate, Tooltip, Typography, Upload, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import ReviewAnalytic from "../../../customers/components/ReviewAnalytic";
import Review from "../../../customers/components/Review";
import { useParams } from "react-router-dom";
import {
    EditOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { ProductResource, ReportEvaluationResource } from "../../../../resources";
import evaluationService from "../../../../services/evaluation-service";
import productService from "../../../../services/product-service";
import { formatCurrencyVND } from "../../../../utils/format";
import EditProductModal from "../../components/modals/EditProductModal";
import useModal from "../../../../hooks/useModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { RcFile, UploadFile } from "antd/es/upload";
import Loading from "../../../shared/Loading";
import CheckBoxImage from "../../components/CheckBoxImage";
import ReactApexChart from "react-apexcharts";
import { getBase64 } from "../../../../utils/file";
import UploadButton from "../../components/UploadButton";
import VariantManagement from "./VariantManagement";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


export type RemoveImagesRequest = {
    imageIds: number[]
}

const ProductDetail: FC = () => {
    const { id } = useParams()
    const [reportEvaluation, setReportEvaluation] = useState<ReportEvaluationResource | null>(null);
    const [product, setProduct] = useState<ProductResource | null>(null)
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [loading, setLoading] = useState(false)

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileRemoves, setFileRemoves] = useState([])

    const fetchEvaluations = async () => {
        const response = await evaluationService.getAllByProductId(id!);

        setReportEvaluation(response.data)
    }

    const fetchProduct = async () => {
        const response = await productService.getProductById(id!);
        setProduct(response.data)
    }

    useEffect(() => {
        fetchProduct();
        fetchEvaluations()
    }, [id])

    const handleSubmit = () => {
        fetchProduct();
        handleOk();
    }

    const handleUploadThumbnail = async (file: string | RcFile | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        await productService.uploadThumbnail(product?.id!, formData);
        await fetchProduct();
        setLoading(false)
        message.success('Cập nhật ảnh thumbnail thành công')
    }

    const handleUploadZoomImage = async (file: string | RcFile | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        await productService.uploadZoomImage(product?.id!, formData);
        await fetchProduct();
        setLoading(false)
        message.success('Cập nhật ảnh phóng to thành công')
    }

    const handleUploadImages = async () => {
        const formData = new FormData();

        fileList.forEach(file => {
            if (file.originFileObj) {
                formData.append('files', file.originFileObj, file.name);
            }
        });

        setLoading(true)
        await productService.uploadImages(product?.id!, formData);
        await fetchProduct();
        setLoading(false)
        setFileList([])
        message.success('Thêm ảnh thành công')
    }

    const thumbnailProps: UploadProps = {
        name: 'thumbnail',
        showUploadList: false,
        customRequest: ({ file }) => {
            handleUploadThumbnail(file)
        }
    };

    const zoomImagesProps: UploadProps = {
        name: 'zoomImage',
        showUploadList: false,
        customRequest: ({ file }) => {
            handleUploadZoomImage(file)
        }
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);


    const handleRemoveImages = async () => {
        const payload: RemoveImagesRequest = {
            imageIds: fileRemoves
        }
        await productService.removeImages(payload);
        fetchProduct()
        setFileRemoves([])
        message.success('Xóa các ảnh thành công')
    }


    return <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-8 flex flex-col gap-y-6 relative h-full overflow-y-auto custom-scrollbar scrollbar-h-4">
            <div className="bg-white shadow-sm rounded-lg p-6 grid grid-cols-12 gap-x-6">
                <div className="col-span-6 flex flex-col gap-y-4">
                    <div className="relative">
                        <Image preview={false} className="rounded-3xl" width='100%' src={product?.thumbnail} />
                        <Tooltip title="Cập nhật ảnh">
                            <span className="absolute -bottom-2 shadow-xl cursor-pointer flex items-center justify-center -right-2 w-10 h-10 rounded-full bg-white">
                                <ImgCrop modalTitle="Cập nhật ảnh" modalCancel="Hủy bỏ" modalOk="Lưu lại" rotationSlider>
                                    <Upload
                                        {...thumbnailProps}
                                    >
                                        <FontAwesomeIcon icon={faCamera} />
                                    </Upload>
                                </ImgCrop>

                            </span>
                        </Tooltip>
                    </div>
                    <div className="relative w-1/3">
                        <Image preview={false} className="rounded-3xl" width='100%' src={product?.zoomImage} />
                        <Tooltip title="Cập nhật ảnh phóng to">
                            <span className="absolute -bottom-2 shadow-xl cursor-pointer flex items-center justify-center -right-2 w-10 h-10 rounded-full bg-white">
                                <ImgCrop modalTitle="Cập nhật ảnh" modalCancel="Hủy bỏ" modalOk="Lưu lại" rotationSlider>
                                    <Upload
                                        {...zoomImagesProps}
                                    >
                                        <FontAwesomeIcon icon={faCamera} />
                                    </Upload>
                                </ImgCrop>

                            </span>
                        </Tooltip>
                    </div>

                </div>
                <div className="col-span-6 flex flex-col gap-y-3">
                    <Typography.Title level={2} className="text-sm" style={{ margin: 0 }}>
                        {product?.name}
                    </Typography.Title>
                    <div className="flex flex-col">
                        <span className="text-lg">Thể loại: <b>{product?.category.name}</b></span>
                        <span className="text-lg">Thương hiệu: <b>{product?.brand.name}</b></span>
                    </div>

                    <div className="flex gap-x-3 items-center">
                        <span className="text-lg flex-1">Mô tả: </span>
                        <p className="text-lg">{product?.description}</p>
                    </div>
                    

                    <div className="flex gap-x-3 items-center">
                        <span className="text-lg">Giá nhập: </span>
                        <span className="text-primary text-lg font-semibold">{formatCurrencyVND(product?.purchasePrice)}</span>
                    </div>

                    <div className="flex gap-x-3 items-center">
                        <span className="text-lg">Giá bán: </span>
                        <span className="line-through text-lg">{formatCurrencyVND(product?.oldPrice)}</span>
                        <span className="text-primary text-2xl font-semibold">{formatCurrencyVND(product?.price)}</span>
                    </div>
                </div>
                <Button onClick={showModal} shape="circle" className="absolute top-4 right-4" icon={<EditOutlined />} ></Button>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col gap-y-4">
                <p className="font-semibold text-[16px]">Các ảnh khác</p>
                <Checkbox.Group defaultValue={['Apple']}></Checkbox.Group>
                <div className="mt-4">
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        <Checkbox.Group value={fileRemoves} onChange={(values) => setFileRemoves(values)} className="flex items-center flex-wrap gap-4" defaultValue={[]}>
                            {product?.images.map(p => <CheckBoxImage image={p} key={p.id} />)}
                            <Upload
                                beforeUpload={(_) => false}
                                onRemove={(value) => console.log(value)}
                                listType="picture-card"
                                fileList={fileList}
                                showUploadList={true}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                multiple

                            >
                                <UploadButton />
                            </Upload>
                        </Checkbox.Group>
                    </Image.PreviewGroup>
                </div>

                <div className="flex gap-x-3 justify-end">
                    {fileList.length > 0 && <>
                        <Button type="primary" onClick={handleUploadImages}>Thêm {fileList.length} ảnh mới</Button>
                        <Button danger onClick={() => setFileList([])}>Reset</Button>
                    </>}
                    {fileRemoves.length > 0 &&
                        <Button danger type="primary" onClick={handleRemoveImages}>Xóa {fileRemoves.length} ảnh</Button>
                    }
                </div>
            </div>
        </div>
        <div className="col-span-4 flex flex-col gap-y-6 h-full">
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col gap-y-3">
                <p className="font-semibold mb-4">Reviews & Rating</p>
                {reportEvaluation?.report.totalEvaluation! > 0 ? <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-4 items-start">
                        <div className="flex flex-col items-start gap-y-1">
                            <div className="flex items-end gap-x-1">
                                <span className="font-bold text-4xl">{reportEvaluation?.report.averageStar.toFixed(1)}</span>
                                <span className="text-gray-600 font-semibold text-xs">/5.0</span>
                            </div>
                            <Rate className="text-sm" allowHalf disabled value={reportEvaluation?.report.averageStar} />
                            <span className="text-gray-600 font-semibold text-xs">{reportEvaluation?.report.totalEvaluation} reviews</span>
                        </div>

                        <div className="flex flex-col gap-y-1 flex-1 px-2">
                            <ReviewAnalytic starPercents={reportEvaluation?.report.starsPercents!} />
                        </div>
                    </div>

                    <ReactApexChart
                        height='150px'
                        options={{
                            labels: reportEvaluation?.report?.starsPercents.map(item => `${item.star} sao`),
                            dataLabels: {
                                enabled: true,
                                formatter: (val: number) => `${val}%`,
                            },
                            plotOptions: {
                                pie: {
                                    expandOnClick: true,
                                },
                            },
                        }}
                        series={reportEvaluation?.report?.starsPercents.map(item => item.percent) ?? []}
                        type="donut"
                    />
                </div>
                    :
                    <Empty description='Chưa có đánh giá nào' />
                }

            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 h-full overflow-y-auto custom-scrollbar scrollbar-h-4">
                <p className="font-semibold mb-4">Các đánh giá</p>
                <div className="overflow-y-auto">
                    {reportEvaluation?.report.totalEvaluation == 0 ? <Empty description='Chưa có đánh giá nào' />
                        : reportEvaluation?.results.map(review => <Review onInteract={fetchEvaluations} key={review.id} review={review} />)}
                </div>
            </div>
        </div>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">Cập nhật sản phẩm</p>}
            onCancel={handleCancel}
            width='800px'
            footer={[]}
        >
            <EditProductModal product={product!} handleOk={handleSubmit} />
        </Modal>
        {loading && <Loading />}

        <div className="col-span-12">
            {product ? <VariantManagement product={product} /> : <Loading />}
        </div>
    </div >
};

export default ProductDetail;
