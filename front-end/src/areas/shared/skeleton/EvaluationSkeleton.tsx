import { Divider, Skeleton } from "antd";
import { FC } from "react";

const EvaluationSkeleton: FC = () => {
    return <div className="flex flex-col gap-y-4">
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Divider />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Divider />
    </div>
};

export default EvaluationSkeleton;
