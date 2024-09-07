import { Button, Form, FormProps, GetProp, Image, Input, UploadFile, UploadProps, message } from "antd";
import { FC, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";
import { getBase64 } from "../../../../utils/file";
import settingService from "../../../../services/setting-service";
import { SlideShowResource } from "../../../../resources";


export type EditSlideShowRequest = {
    title: string;
    description: string;
    btnTitle: string;
    backgroundImage?: UploadFile[]
};

type EditSlideShowProps = {
    handleOk: () => void;
    slideShow: SlideShowResource;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const EditSlideShowModal: FC<EditSlideShowProps> = ({
    handleOk,
    slideShow
}) => {
    const [form] = Form.useForm<EditSlideShowRequest>();
    const [preview, setPreview] = useState(slideShow.backgroundImage)
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<EditSlideShowRequest>['onFinish'] = async (values) => {
        const payload = new FormData();
        payload.append('title', values.title);
        payload.append('description', values.description);
        payload.append('btnTitle', values.btnTitle);

        if(values.backgroundImage) {
            values.backgroundImage.forEach(file => {
                if (file.originFileObj) {
                    payload.append('backgroundImage', file.originFileObj, file.name);
                }
            })
        }


        setLoading(true)
        try {
            await settingService.editSlideShow(slideShow.id, payload);
            message.success('Cập nhật thành công')
            form.resetFields();
            setPreview('')
            handleOk()
        } catch (e) {
            message.error('Cập nhật thất bại')
        } finally {
            setLoading(false)
        }
            
        
    };

    const onFinishFailed: FormProps<EditSlideShowRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = async (fileList: UploadFile[]) => {
        const previewUrl = await getBase64(fileList[0].originFileObj as FileType)
        setPreview(previewUrl)
        form.setFieldValue('backgroundImage', fileList)
    }

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
                title: slideShow.title,
                btnTitle: slideShow.btnTitle,
                description: slideShow.description
            }}
        >
            <Form.Item<EditSlideShowRequest>
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}
            >
                <Input size="large" placeholder="Tiêu đề ..." />
            </Form.Item>

            <Form.Item<EditSlideShowRequest>
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Mô tả ..." />
            </Form.Item>

            <Form.Item<EditSlideShowRequest>
                label="Tiêu đề nút"
                name="btnTitle"
                rules={[{ required: true, message: 'Tiêu đề nút không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Tiêu đề nút ..." />
            </Form.Item>

            <Form.Item<EditSlideShowRequest>
                label="Hình nền"
                name="backgroundImage"
            >
                <div className="relative w-full h-[200px]">
                    {preview && <Image width='100%' height='100%' preview={false} className="object-cover absolute inset-0 z-10" src={preview} />}
                    <div className={`absolute inset-0 z-50`}>
                        <Dragger
                            name="file"
                            className={`${preview && 'text-white'}`}
                            beforeUpload={(_) => false}
                            fileList={form.getFieldValue('backgroundImage')}
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
            </Form.Item>



            <div className="flex justify-end">
                <Form.Item>
                    <Button disabled={loading} loading={loading} shape="round" size="large" className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default EditSlideShowModal;