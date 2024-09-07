import { Divider, Skeleton } from "antd";
import { FC } from "react";

const FilterOptionsSkeleton: FC = () => {
    return <div className="col-span-2 border-r-[1px] border-slate-100 px-4 flex flex-col gap-y-4">
        <Skeleton paragraph={{ rows: 3 }} />
        <Divider />
        <Skeleton paragraph={{ rows: 3 }} />
 
    </div>
};

export default FilterOptionsSkeleton;
