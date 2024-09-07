import { FC, useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { Breadcrumb } from "antd";
import { BlogResource } from "../../../resources";
import blogService from "../../../services/blog-service";
import GridBlogSkeleton from "../../shared/skeleton/GridBlogSkeleton";

const BlogPage: FC = () => {
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState<BlogResource[]>([])
  
    const fetchBlogs = async () => {
        const response = await blogService.getAllBlogs();
        setBlogs(response.data)
    }

    useEffect(() => {
        setLoading(true)
        fetchBlogs();
        setLoading(false)
    }, [])

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
                    href: '',

                },
            ]}
        />

        {loading ?
            <GridBlogSkeleton />
            :
            <div className="grid grid-cols-3 gap-8">
                {blogs.map(blog => <BlogItem key={blog.id} blog={blog} />)}
            </div>
        }
    </div>
};

export default BlogPage;
