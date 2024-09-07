import { Skeleton } from "antd";
import { FC } from "react";

const GridBlogSkeleton: FC = () => {
    return <div className="grid grid-cols-3 gap-x-8">
        <div className="flex flex-col gap-y-4">
            <Skeleton.Button size="large" style={{
                height: 250
            }} block active />

            <Skeleton paragraph={{ rows: 2 }} />
        </div>
        <div className="flex flex-col gap-y-4">
            <Skeleton.Button size="large" style={{
                height: 250
            }} block active />

            <Skeleton paragraph={{ rows: 2 }} />
        </div>
        <div className="flex flex-col gap-y-4">
            <Skeleton.Button size="large" style={{
                height: 250
            }} block active />

            <Skeleton paragraph={{ rows: 2 }} />
        </div>
    </div>
};

export default GridBlogSkeleton;
