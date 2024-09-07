import { Button, Checkbox, GetProp, Slider, Tag, Tree, TreeDataNode, TreeProps } from "antd";
import React, { FC, useEffect, useState } from "react";
import GroupColorCheckable from "../customers/components/GroupColorCheckable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ProductFilter } from "../customers/pages/ShopPage";
import { BrandResource, CategoryLevelResource, ColorResource, SizeResource } from "../../resources";
import categoryService from "../../services/category-service";
import brandService from "../../services/brand-service";
import colorService from "../../services/color-service";
import sizeService from "../../services/size-service";

type AdvancedFilterProps = {
    onChange: (params: ProductFilter) => void,
    queryParams: ProductFilter
}

const createCategoryTree = (categories: CategoryLevelResource[]): TreeDataNode[] => {
    return categories.map(category => ({
        className: 'relative -left-4',
        key: category.id,
        title: category.name,
        children: category.categoryChildren ? createCategoryTree(category.categoryChildren) : null
    } as TreeDataNode))
}

const AdvancedFilter: FC<AdvancedFilterProps> = ({
    onChange,
    queryParams
}) => {
    const [colors, setColors] = useState<ColorResource[]>([])
    const [sizes, setSizes] = useState<SizeResource[]>([])
    const [brands, setBrands] = useState<BrandResource[]>([])
    const [selectedTags, setSelectedTags] = React.useState<number[]>([]);
    const [categoryTree, setCategoryTree] = useState<TreeDataNode[]>([])

    const [params, setParams] = useState<ProductFilter>(queryParams);

    const fetchFilterOptions = async () => {
        const responseCategory = await categoryService.getAllCategoriesByLevel();
        setCategoryTree(createCategoryTree(responseCategory.data))

        const responseBrand = await brandService.getAllBrands();
        setBrands(responseBrand.data)

        const responseColor = await colorService.getAllColors();
        setColors(responseColor.data)

        const responseSize = await sizeService.getAllSizes();
        setSizes(responseSize.data)
    }

    useEffect(() => {
        fetchFilterOptions()
    }, [params])

    useEffect(() => {
        setParams(queryParams)
    }, [queryParams])

    const onCheck: TreeProps['onCheck'] = (checkedKeys: any, _) => {
        setParams({
            ...params,
            categoryIds: checkedKeys.checked as number[]
        })
    };

    const handleBrandChange: GetProp<typeof Checkbox.Group, 'onChange'> = (values: unknown[]) => {
        setParams({
            ...params,
            brandIds: values as number[]
        })
    };

    const handleChange = (size: SizeResource, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, size.id]
            : selectedTags.filter((t) => t !== size.id);
        setSelectedTags(nextSelectedTags);
        setParams({
            ...params,
            sizeIds: nextSelectedTags
        });
    };

    return <div className="col-span-2 border-r-[1px] border-slate-100">
        <h2 className="text-2xl font-semibold mb-4">Bộ lọc</h2>
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-600">Danh mục</span>
                <Tree
                    className="px-0"
                    checkable
                    checkedKeys={params.categoryIds}
                    onCheck={onCheck}
                    treeData={categoryTree}
                    checkStrictly
                    switcherIcon={<FontAwesomeIcon icon={faChevronDown} />}
                    selectable={false}
                />
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-600">Thương hiệu</span>
                <Checkbox.Group className="flex flex-col p-2 gap-y-2" options={brands.map(brand => ({
                    label: brand.name,
                    value: brand.id,
                }))} defaultValue={[]} value={params.brandIds} onChange={handleBrandChange} />
            </div>

            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-600">Kích cỡ</span>
                <div className="flex p-2 gap-y-3 flex-wrap">
                    {sizes.map<React.ReactNode>((size) => (
                        <Tag.CheckableTag
                            key={size.id}
                            className="border-[1px] border-gray-200 text-[13px] font-semibold py-1 px-4 rounded-2xl"
                            checked={selectedTags.includes(size.id)}
                            onChange={(checked) => handleChange(size, checked)}
                        >
                            {size.eSize}
                        </Tag.CheckableTag>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-600">Giá</span>
                <div className="w-full p-2">
                    <Slider onChange={(values: number[]) => {
                        setParams({
                            ...params,
                            minPrice: values[0],
                            maxPrice: values[1],
                        })
                    }} range={{ draggableTrack: true }} min={1} max={10000000} defaultValue={[1, 10000000]} />
                </div>
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-600">Màu sắc</span>
                <div className="flex p-2 gap-x-2 gap-y-3 flex-wrap">
                    <GroupColorCheckable
                        colors={colors}
                        value={params.colorIds}
                        onChange={(values) => {
                            setParams({
                                ...params,
                                colorIds: values
                            })
                        }}
                    />
                </div>
            </div>
        </div>
        <div className="flex gap-x-3 items-center pr-4">
            <Button onClick={() => {
                const resetParams : ProductFilter = {
                    ...params,
                    pageIndex: 1,
                    pageSize: 8,
                    brandIds: [],
                    categoryIds: [],
                    colorIds: [],
                    maxPrice: 10000000,
                    minPrice: 0,
                    sizeIds: [],
                    sortOrder: undefined,
                    sortBy: undefined
                }

                setSelectedTags([])
                setParams(resetParams)
                onChange(resetParams)
            }} className="w-full mt-4" type="default">Reset</Button>
            <Button onClick={() => onChange(params)} className="w-full mt-4" type="primary">Lọc</Button>
        </div>
    </div>
};

export default AdvancedFilter;
