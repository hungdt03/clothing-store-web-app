import { Button, GetProp, Image, Upload, UploadFile, UploadProps } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { FC, useState } from "react";
import { getBase64 } from "../../../../utils/file";

const { Dragger } = Upload;


type PublishBlogModalProps = {
    handleThumbnailChange: (fileList: UploadFile[]) => void,
    handlePublishBlog: () => Promise<boolean>,
    previewUrl?: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const PublishBlogModal: FC<PublishBlogModalProps> = ({
    handleThumbnailChange,
    handlePublishBlog,
    previewUrl = ''
}) => {
    const [fileThumbnail, setFileThumbnail] = useState<UploadFile[]>([]);
    const [preview, setPreview] = useState(previewUrl)

    const handleChange = async (fileList: UploadFile[]) => {
        const previewUrl = await getBase64(fileList[0].originFileObj as FileType)
        setPreview(previewUrl)
        setFileThumbnail(fileList)
        handleThumbnailChange(fileList)
    }

    const handleSubmit = async () => {
        const result = await handlePublishBlog()
        if (result) {
            setFileThumbnail([])
        }

    }

    return <div className="flex flex-col items-center gap-y-4">

        <div className="relative w-[400px] h-[250px]">
            {preview && <Image width='100%' height='100%' preview={false} className="object-cover absolute inset-0 z-10" src={preview} />}
            <div className={`absolute inset-0 z-50`}>
                <Dragger
                    name="file"
                    className={`${preview && 'text-white'}`}
                    beforeUpload={(_) => false}
                    fileList={fileThumbnail}
                    onChange={(info) => handleChange(info.fileList)}
                    multiple={false}
                    showUploadList={false}
                    maxCount={1}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className={`${!preview && 'text-black'}`}>Kéo thả ảnh hoặc bấm chọn ảnh vào khu vực này</p>
                    <p className={`${!preview && 'text-gray-500'}`}>
                        Ảnh đại diện hấp dẫn giúp bài viết của bạn cuốn hút hơn với độc giả.
                    </p>
                </Dragger>
            </div>
        </div>

        <Button onClick={handleSubmit} type="primary">Xuất bản ngay</Button>
    </div>
};

export default PublishBlogModal;
