import { Button } from "antd";
import { FC } from "react";

const CreateBlogTool: FC = () => {
    return <div className="flex justify-center items-center gap-x-2 p-2 rounded-lg bg-emerald-600 text-white">
        <Button type="dashed">Text</Button>
        <Button type="dashed">Ảnh</Button>
        <Button type="dashed">Link</Button>
    </div>
};

export default CreateBlogTool;
