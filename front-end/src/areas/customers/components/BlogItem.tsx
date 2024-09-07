import { Image } from "antd";
import { FC } from "react";
import images from "../../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { BlogResource } from "../../../resources";
import { formatDateTime } from "../../../utils/format";
import { Link } from "react-router-dom";

type BlogItemProps = {
    blog: BlogResource
}


const BlogItem: FC<BlogItemProps> = ({
    blog
}) => {
    return <div className="shadow-sm w-full">
        <Image preview={false} src={blog.thumbnail ?? images.demoMenth} height='300px' width='100%' className="object-cover" />

        <div className="flex flex-col gap-y-3 p-5">
            <div className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faCalendar} />
                <span className="font-semibold text-gray-600">{formatDateTime(new Date(blog.createdDate))}</span>
            </div>
            <Link to={`/blog/${blog.id}`} className="font-semibold text-xl line-clamp-2">{blog.title}</Link>
            <div
                className="text-[16px] line-clamp-1"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />

        </div>
    </div>
};

export default BlogItem;
