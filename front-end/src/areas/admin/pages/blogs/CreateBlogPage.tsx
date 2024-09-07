import { Button, Divider, Modal, UploadFile, message } from "antd";
import { ChangeEvent, FC, useState } from "react";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import cloudinaryService from "../../../../services/cloudinary-service";
import blogService from "../../../../services/blog-service";
import Loading from "../../../shared/Loading";
import useModal from "../../../../hooks/useModal";
import PublishBlogModal from "../../components/modals/PublishBlogModal";
import { useNavigate } from "react-router-dom";

// Initialize markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

export type BlogRequest = {
    title: string;
    content: string;
    textPlain: string;
    thumbnail: UploadFile[]
}

const initialValues: BlogRequest = {
    title: '',
    content: '',
    textPlain: '',
    thumbnail: []
}

const CreateBlogPage: FC = () => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()
    const [blog, setBlog] = useState<BlogRequest>(initialValues);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleEditorChange({ html, text }: { html: string, text: string }) {
        setBlog({
            ...blog,
            content: html,
            textPlain: text
        })
    }

    async function handleImageUpload(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("cloud_name", 'dofkizpzl');
        formData.append("upload_preset", "my_blog_preset");

        const response = await cloudinaryService.uploadImage(formData)
        return response.secure_url;
    }

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBlog({
            ...blog,
            title: e.target.value
        })
    }

    const handleCreateBlog = async () => {
        const payload = new FormData();
        payload.append('title', blog.title)
        payload.append('content', blog.content)
        payload.append('textPlain', blog.textPlain)
        blog.thumbnail.forEach(file => {
            if (file.originFileObj) {
                payload.append('thumbnail', file.originFileObj, file.name);
            }
        });

        setLoading(true)
        const response = await blogService.createBlog(payload);
        setLoading(false)
        if (response.success) {
            message.success(response.message)

            setBlog({
                title: '',
                content: '',
                textPlain: '',
                thumbnail: []
            })

            handleOk()
            navigate('/admin/blog')
            return true;
        }
        else {
            message.error(response.message)
            return false;
        }
    }

    return (
        <div className="w-full h-full">
            {loading && <Loading />}
            <div className="flex justify-between items-center bg-white px-4">
                <input
                    className="border-none outline-none text-2xl w-full h-16"
                    placeholder="Nhập tiêu đề ở đây"
                    value={blog.title}
                    onChange={handleTitleChange}
                />
                <Button onClick={showModal} disabled={!blog.title || !blog.content} type="primary" size="large" shape="round">Xuất bản</Button>
            </div>
            <Divider className="mt-1 mb-0" />
            <MdEditor
                style={{ height: '90vh' }}
                renderHTML={text => mdParser.render(text)}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
                value={blog.textPlain}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Xem trước</p>}
                onCancel={handleCancel}
                width='600px'
                footer={[]}
            >
                <PublishBlogModal handleThumbnailChange={(fileList) => setBlog({
                    ...blog,
                    thumbnail: fileList
                })} handlePublishBlog={() => handleCreateBlog()} />
            </Modal>
        </div>
    );
};

export default CreateBlogPage;
