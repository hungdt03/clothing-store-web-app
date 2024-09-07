import { Button, Divider, Modal, UploadFile, message } from "antd";
import { ChangeEvent, FC, useEffect, useState } from "react";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import cloudinaryService from "../../../../services/cloudinary-service";
import blogService from "../../../../services/blog-service";
import Loading from "../../../shared/Loading";
import useModal from "../../../../hooks/useModal";
import PublishBlogModal from "../../components/modals/PublishBlogModal";
import { useNavigate, useParams } from "react-router-dom";
import { BlogResource } from "../../../../resources";

// Initialize markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

export type EditBlogRequest = {
    title: string;
    content: string;
    textPlain: string;
    thumbnail?: UploadFile[]
}

const initialValues: EditBlogRequest = {
    title: '',
    content: '',
    textPlain: '',
    thumbnail: []
}

const EditBlogPage: FC = () => {
    const { id } = useParams()
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()
    const [blog, setBlog] = useState<BlogResource | null>(null);
    const [blogPayload, setBlogPayload] = useState<EditBlogRequest>(initialValues);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleEditorChange({ html, text }: { html: string, text: string }) {
        setBlogPayload({
            ...blogPayload,
            content: html,
            textPlain: text
        })
    }

    const fetchBlog = async () => {
        const response = await blogService.getBlogById(id!);
        setBlog(response.data)
        setBlogPayload({
            ...blogPayload,
            title: response.data.title,
            content: response.data.content,
            textPlain: response.data.textPlain
        })
    }

    useEffect(() => {
        fetchBlog();
    }, [])

    async function handleImageUpload(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("cloud_name", 'dofkizpzl');
        formData.append("upload_preset", "my_blog_preset");

        const response = await cloudinaryService.uploadImage(formData)
        return response.secure_url;
    }

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBlogPayload({
            ...blogPayload,
            title: e.target.value
        })
    }

    const handleSaveBlog = async () => {
        const payload = new FormData();
        payload.append('title', blogPayload.title)
        payload.append('content', blogPayload.content)
        payload.append('textPlain', blogPayload.textPlain)
        blogPayload?.thumbnail?.forEach(file => {
            if (file.originFileObj) {
                payload.append('thumbnail', file.originFileObj, file.name);
            }
        });

        try {
            setLoading(true)
            await blogService.updateBlog(id!, payload);
            setLoading(false)
            message.success('Cập nhật bài viết thành công')

            setBlogPayload({
                title: '',
                content: '',
                textPlain: '',
                thumbnail: []
            })

            handleOk()
            navigate('/admin/blog')
            return true;
        } catch {
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
                    value={blogPayload.title}
                    onChange={handleTitleChange}
                />
                <Button onClick={showModal} disabled={!blogPayload.title || !blogPayload.content} type="primary" size="large" shape="round">Lưu lại</Button>
            </div>
            <Divider className="mt-1 mb-0" />
            <MdEditor
                style={{ height: '90vh' }}
                renderHTML={text => mdParser.render(text)}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
                value={blogPayload.textPlain}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Xem trước</p>}
                onCancel={handleCancel}
                width='600px'
                footer={[]}
            >
                <PublishBlogModal handleThumbnailChange={(fileList) => setBlogPayload({
                    ...blogPayload,
                    thumbnail: fileList,
                })} handlePublishBlog={() => handleSaveBlog()} previewUrl={blog?.thumbnail} />
            </Modal>
        </div>
    );
};

export default EditBlogPage;
