import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Pagination, Popover, TreeDataNode } from "antd";
import React, { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { CategoryLevelResource, ProductResource } from "../../../resources";
import productService from "../../../services/product-service";
import Product from "../components/Product";
import GridProductSkeleton from "../../shared/skeleton/GridProductSkeleton";
import AdvancedFilter from "../../shared/AdvancedFilter";
import SortSelection from "../../shared/SortSelection";


const bannerStyle: React.CSSProperties = {
    margin: 0,
    color: '#fff',
    height: '30vh',
    flex: 1,
    backgroundImage: `
        url(https://suruchi-demo.myshopify.com/cdn/shop/files/1920_800_cefb5c88-9e82-49b9-b48a-594ed3b439f0.png?v=1691247183)
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};


export type ProductFilter = {
    pageIndex: number;
    name?: string;
    pageSize: number;
    categoryIds?: number[];
    brandIds?: number[];
    colorIds?: number[];
    sizeIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price" | "name"
    sortOrder?: "asc" | "desc"
}

const createCategoryTree = (categories: CategoryLevelResource[]): TreeDataNode[] => {
    return categories.map(category => ({
        key: category.id,
        title: category.name,
        children: category.categoryChildren ? createCategoryTree(category.categoryChildren) : null
    } as TreeDataNode))
}

const initialValues: ProductFilter = {
    pageIndex: 1,
    pageSize: 12,
    minPrice: 1,
    maxPrice: 10000000
}

const ShopPage: FC = () => {
    const [products, setProducts] = useState<ProductResource[]>([])
    const [params, setParams] = useState<ProductFilter>(initialValues);
    const [totalItems, setTotalItems] = useState(8)
    const [loading, setLoading] = useState(false)

    const fetchProducts = async (queryParams: ProductFilter) => {
        const response = await productService.getAllProducts(queryParams);
        setProducts(response.data)
        setTotalItems(response.pagination.totalItems)
    }

    useEffect(() => {
        setLoading(true)
        fetchProducts(params)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [params])

    return <div className="flex flex-col">
        <div className="flex justify-between">
            <div className="bg-[#f7f7f7]">
            </div>
            <div style={bannerStyle}></div>
        </div>
        <div className="px-10 mt-6 flex flex-col gap-y-6">
            <div className="bg-slate-50 flex justify-between py-8 px-4">
                <div className="flex gap-x-4">
                    <FontAwesomeIcon icon={faSquare} />
                </div>
                <div className="flex items-center gap-x-4">
                    <Popover arrow={false} trigger='click' title={<SortSelection
                        queryParams={params}
                        onChange={(queryParams: ProductFilter) => setParams({
                            ...params,
                            ...queryParams
                        })}
                    />} placement="bottomRight">
                        <div className="flex gap-x-2 items-center cursor-pointer">
                            <Image
                                preview={false}
                                src={images.sort}
                                width='20px'
                            />
                            <span className="text-lg font-semibold">Sắp xếp</span>
                        </div>
                    </Popover>
                    <span className="text-lg">{products?.length} sản phẩm</span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
                <AdvancedFilter
                    queryParams={params}
                    onChange={(queryParams: ProductFilter) => setParams({
                        ...params,
                        ...queryParams,
                        pageIndex: 1
                    })}
                />
                <div className="col-span-10">
                    {loading ? <GridProductSkeleton /> : <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                        {products.map(product => <Product key={product.id} product={product} />)}
                    </div>}

                    <div className="mt-4 flex justify-center">
                        {totalItems > params.pageSize && <Pagination current={params.pageIndex} onChange={(value) => {
                            const updateParams = {
                                ...params,
                                pageIndex: value
                            }

                            setParams(updateParams)

                        }} showLessItems pageSize={params.pageSize} total={totalItems} />}
                    </div>
                </div>

            </div>
        </div>
    </div>;
};

export default ShopPage;
