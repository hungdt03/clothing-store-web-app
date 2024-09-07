import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    MoreOutlined
} from '@ant-design/icons';
import { BlogResource } from "../../../resources";
import blogService from "../../../services/blog-service";
import { Avatar, Breadcrumb, Button, Divider } from "antd";
import BlogItem from "../components/BlogItem";
import { formatDateTime } from "../../../utils/format";
import BlogItemRow from "../components/BlogItemRow";

const BlogDetailPage: FC = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState<BlogResource | null>(null)
    const [relatedBlog, setRelatedBlog] = useState<BlogResource[]>([])
    const [otherBlogs, setOtherBlogs] = useState<BlogResource[]>([])



    const fetchRelatedBlogs = async () => {
        const response = await blogService.getAllBlogRelatedUserId(blog?.user.id!, id!);
        setRelatedBlog(response.data)
    }

    const fetchOtherBlogs = async () => {
        const response = await blogService.getAllBlogExceptBlogId(id!);
        setOtherBlogs(response.data)
    }

    const fetchBlog = async () => {
        const response = await blogService.getBlogById(id!);
        console.log(response)
        setBlog(response.data)
    }

    useEffect(() => {
        fetchBlog()
        fetchOtherBlogs()
    }, [id])

    useEffect(() => {
        fetchRelatedBlogs()
    }, [blog])

    return <div className="bg-slate-50 px-10">
        <Breadcrumb
            className="my-10 text-[17px]"
            separator=">"
            items={[
                {
                    title: 'Trang chủ',
                    href: '/'
                },
                {
                    title: 'Bài viết',
                    href: '/blog',
                },
                {
                    title: blog?.title ?? 'Loading',
                    href: '',
                },
            ]}
        />

        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8 flex flex-col gap-y-6">
                <span className="text-3xl font-bold">{blog?.title}</span>
                <div className="flex items-center justify-between">
                    <div className="flex gap-x-2 items-center">
                        <Avatar size='large' src={blog?.user.avatar} />
                        <div className="flex flex-col">
                            <span className="font-semibold">{blog?.user.name}</span>
                            <span>{formatDateTime(new Date(blog?.createdDate!))}</span>
                        </div>
                    </div>
                    <Button shape="circle" className="rotate-90" icon={<MoreOutlined />}>
                    </Button>
                </div>
                {blog && <div
                    className="prose w-full"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                }

                <Divider />
                <span>CÁC BÀI VIẾT KHÁC CÙNG TÁC GIẢ</span>

                <div className="grid grid-cols-2 gap-4">
                    {relatedBlog?.map(blog => <BlogItem key={blog.id} blog={blog} />)}
                </div>
            </div>

            <div className="col-span-4">
                <div className="flex flex-col gap-y-4">
                    {otherBlogs?.map(blog => <BlogItemRow key={blog.id} blog={blog} />)}
                </div>
            </div>
        </div>
    </div>

};

export default BlogDetailPage;
