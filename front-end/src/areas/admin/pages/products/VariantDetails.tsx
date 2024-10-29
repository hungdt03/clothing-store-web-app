import { Button, Checkbox, GetProp, Image, Modal, Tooltip, Typography, Upload, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    EditOutlined,
    PlusOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { VariantResource } from "../../../../resources";
import useModal from "../../../../hooks/useModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { RcFile, UploadFile } from "antd/es/upload";
import Loading from "../../../shared/Loading";
import CheckBoxImage from "../../components/CheckBoxImage";
import variantService from "../../../../services/variant-service";
import EditVariantModal from "../../components/modals/EditVariantModal";
import images from "../../../../assets";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export type RemoveImagesRequest = {
    imageIds: number[]
}

const VariantDetail: FC = () => {
    const { id } = useParams()
    const [variant, setVariant] = useState<VariantResource | null>(null)
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [loading, setLoading] = useState(false)

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileRemoves, setFileRemoves] = useState([])

    const fetchVariant = async () => {
        const response = await variantService.getVariantById(id!);
        console.log(response)
        setVariant(response.data)
    }

    useEffect(() => {
        fetchVariant();
    }, [id])

    const handleSubmit = () => {
        fetchVariant();
        handleOk();
    }

    const handleUploadThumbnail = async (file: string | RcFile | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        await variantService.uploadThumbnail(variant?.id!, formData);
        await fetchVariant();
        setLoading(false)
        message.success('Cập nhật ảnh thumbnail thành công')
    }


    const handleUploadImages = async () => {
        const formData = new FormData();

        fileList.forEach(file => {
            if (file.originFileObj) {
                formData.append('files', file.originFileObj, file.name);
            }
        });

        setLoading(true)
        await variantService.uploadImages(variant?.id!, formData);
        await fetchVariant();
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

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

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
        await variantService.removeImages(payload);
        fetchVariant()
        setFileRemoves([])
        message.success('Xóa các ảnh thành công')
    }


    return <>
        <div className="flex flex-col gap-y-6 relative">
            <div className="bg-white shadow-sm rounded-lg p-6 grid grid-cols-12 gap-x-6">
                <div className="col-span-6 flex flex-col gap-y-4">
                    <div className="relative">
                        <Image preview={false} onError={(e) => {
                            e.currentTarget.src = images.demoMenth; 
                        }} className="rounded-3xl object-cover" width='100%' src={variant?.thumbnailUrl ?? images.demoMenth} />
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

                </div>
                <div className="col-span-6 flex flex-col gap-y-3">
                    <Typography.Title level={2} className="text-sm" style={{ margin: 0 }}>
                        {variant?.product.name}
                    </Typography.Title>
                    <div className="flex flex-col">
                        <span className="text-lg">Màu sắc: <b>{variant?.color.name}</b></span>
                        <span className="text-lg">Kích cỡ: <b>{variant?.size.eSize}</b></span>
                        <span className="text-lg">Tồn kho: <b>{variant?.inStock}</b></span>
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
                            {variant?.images.map(p => <CheckBoxImage image={p} key={p.id} />)}
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
                                {uploadButton}
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

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">Cập nhật thông tin</p>}
            onCancel={handleCancel}
            width='800px'
            footer={[]}
        >
            <EditVariantModal variant={variant!} handleOk={handleSubmit} />
        </Modal>
        {loading && <Loading />}
    </>

};

export default VariantDetail;
