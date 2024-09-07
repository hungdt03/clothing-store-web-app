import { Button, Form, FormProps, GetProp, Image, Input, UploadFile, UploadProps, message } from "antd";
import { FC, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";
import { getBase64 } from "../../../../utils/file";
import settingService from "../../../../services/setting-service";


export type CreateSlideShowRequest = {
    title: string;
    description: string;
    btnTitle: string;
    backgroundImage: UploadFile[]
};

type CreateSlideShowProps = {
    handleOk: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateSlideShowModal: FC<CreateSlideShowProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<CreateSlideShowRequest>();
    const [preview, setPreview] = useState('')
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<CreateSlideShowRequest>['onFinish'] = async (values) => {
        const payload = new FormData();
        payload.append('title', values.title);
        payload.append('description', values.description);
        payload.append('btnTitle', values.btnTitle);

        values?.backgroundImage?.forEach(file => {
            if (file.originFileObj) {
                payload.append('backgroundImage', file.originFileObj, file.name);
            }
        })


        setLoading(true)
        const response = await settingService.createSlideShow(payload);
        if (response.success) {
            message.success(response.message)
            form.resetFields();
            setPreview('')
            handleOk()
        } else message.error(response.message)
        setLoading(false)
    };

    const onFinishFailed: FormProps<CreateSlideShowRequest>['onFinishFailed'] = (errorInfo) => {
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
        >
            <Form.Item<CreateSlideShowRequest>
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}
            >
                <Input size="large" placeholder="Tiêu đề ..." />
            </Form.Item>

            <Form.Item<CreateSlideShowRequest>
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Mô tả ..." />
            </Form.Item>

            <Form.Item<CreateSlideShowRequest>
                label="Tiêu đề nút"
                name="btnTitle"
                rules={[{ required: true, message: 'Tiêu đề nút không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Tiêu đề nút ..." />
            </Form.Item>

            <Form.Item<CreateSlideShowRequest>
                label="Tiêu đề nút"
                name="backgroundImage"
                rules={[{ required: true, message: 'Chưa chọn hình nền nào!' }]}
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

export default CreateSlideShowModal;