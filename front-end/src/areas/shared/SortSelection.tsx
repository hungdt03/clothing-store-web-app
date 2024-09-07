import { Button, Divider, Radio, RadioChangeEvent } from "antd";
import { FC, useState } from "react";
import { ProductFilter } from "../customers/pages/ShopPage";

type SortSelectionProps = {
    queryParams: ProductFilter;
    onChange: (params: ProductFilter) => void;
}

const sortOptions = [
    { label: 'Giá', value: 'price' },
    { label: 'Tên sản phẩm', value: 'name' },
];

const SortSelection: FC<SortSelectionProps> = ({
    queryParams,
    onChange
}) => {
    const [params, setParams] = useState<ProductFilter>(queryParams)

    const handleOrderSortChange = (e: RadioChangeEvent) => {
        setParams({
            ...params,
            sortOrder: e.target.value
        })
    };

    const handleSortByChange = ({ target: { value } }: RadioChangeEvent) => {
        setParams({
            ...params,
            sortBy: value,
            sortOrder: "asc"
        })
    };

    const handleReset = () => {
        const updatedParams : ProductFilter = {
            ...params,
            sortBy: undefined,
            sortOrder: undefined
        }
        setParams(updatedParams)

        onChange(updatedParams)
    }
    return <div className="flex flex-col gap-y-2">
        <span className="font-semibold">Sắp xếp</span>
        <Divider className="my-0" />
        <Radio.Group optionType="button" buttonStyle="solid" options={sortOptions} onChange={handleSortByChange} value={params.sortBy} />
        <div className="flex flex-col gap-y-2">
            <span className="font-semibold text-gray-500">
                {params.sortBy === "price" && sortOptions[0].label}
                {params.sortBy === "name" && sortOptions[1].label}
            </span>
            <Radio.Group className="flex flex-col gap-y-2 font-normal" onChange={handleOrderSortChange} value={params.sortOrder}>
                {params.sortBy === 'price' && <>
                    <Radio value="asc">Tăng dần</Radio>
                    <Radio value="desc">Giảm dần</Radio>
                </>}

                {params.sortBy === 'name' && <>
                    <Radio value="asc">A - Z</Radio>
                    <Radio value="desc">Z - A</Radio>
                </>}
            </Radio.Group>
        </div>
        <Divider className="mt-0 mb-1" />
        <div className="flex items-center justify-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button type="primary" disabled={!params.sortBy} onClick={() => onChange(params)}>Áp dụng</Button>
        </div>
    </div>
};

export default SortSelection;
