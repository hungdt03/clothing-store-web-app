import { Skeleton } from "antd";
import { FC } from "react";

const GridProductSkeleton: FC = () => {
    return <div className="w-full grid grid-cols-4 gap-8 px-10">
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

export default GridProductSkeleton;
