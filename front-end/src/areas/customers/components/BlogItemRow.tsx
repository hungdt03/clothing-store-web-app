import { FC } from "react";
import { BlogResource } from "../../../resources";
import { Image } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../../utils/format";
import { Link } from "react-router-dom";
import images from "../../../assets";

type BlogItemRowProps = {
    blog: BlogResource
}


const BlogItemRow: FC<BlogItemRowProps> = ({
    blog
}) => {
    return <div className="shadow-sm flex items-center gap-x-2">
        <div className="flex-1">
            <Image preview={false} src={blog.thumbnail ?? images.demoMenth} width='80px' height='80px' className="object-cover" />
        </div>

        <div className="flex flex-col gap-y-1">
            <Link to={`/blog/${blog.id}`} className="font-semibold text-[16px] line-clamp-1">{blog.title}</Link>
            <div
                className="text-[14px] font-thin line-clamp-1"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="flex items-center gap-x-2">
                <FontAwesomeIcon icon={faCalendar} />
                <span className="font-semibold text-[14px] text-gray-600">{formatDateTime(new Date(blog.createdDate))}</span>
            </div>
        </div>
    </div>
};

export default BlogItemRow;
