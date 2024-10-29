import { FC, useEffect, useState } from "react";
import productService from "../../../services/product-service";
import { ProductResource } from "../../../resources";
import GridProductSkeleton from "../../shared/skeleton/GridProductSkeleton";
import Product from "./Product";
import { ProductFilter } from "../pages/ShopPage";

type ProductTab = "All" | "BestSeller" | "TopRating"

const ProductTabs: FC = () => {
    const [tab, setTab] = useState<ProductTab>("All");
    const [products, setProducts] = useState<ProductResource[]>([])

    const [loading, setLoading] = useState(false)

    const fetchProducts = async () => {
        setLoading(true)
        const response = await productService.getAllProducts({
            pageIndex: 1,
            pageSize: 8
        } as ProductFilter);

        setTimeout(() => {
            setLoading(false)
            setProducts(response.data)
        }, 500)
    }

    const fetchTopFavoriteProducts = async () => {
        setLoading(true)
        const response = await productService.getTopFavoriteProducts();
        setTimeout(() => {
            setLoading(false)
            setProducts(response.data)
        }, 500)
    }

    const fetchTopBestSellerProducts = async () => {
        setLoading(true)
        const response = await productService.getTopBestSellerProducts();
        setTimeout(() => {
            setLoading(false)
            setProducts(response.data)
        }, 500)
    }

    useEffect(() => {
        if (tab === "All")
            fetchProducts();
        else if (tab === "BestSeller")
            fetchTopBestSellerProducts()
        else fetchTopFavoriteProducts()
    }, [tab])
    return <div className="flex flex-col items-center gap-y-8">
        <div className="flex gap-x-8 items-center">
            <button onClick={() => setTab('All')} className="text-xl font-semibold cursor-pointer hover:text-primary hover:border-b-[1px] hover:border-primary text-gray-600 transition-all duration-200">Tất cả</button>
            <button onClick={() => setTab('BestSeller')} className="text-xl font-semibold cursor-pointer hover:text-primary hover:border-b-[1px] hover:border-primary text-gray-600 transition-all duration-200">Bán chạy nhất</button>
            <button onClick={() => setTab('TopRating')} className="text-xl font-semibold cursor-pointer hover:text-primary hover:border-b-[1px] hover:border-primary text-gray-600 transition-all duration-200">Yêu thích nhất</button>
        </div>

        {loading ? <GridProductSkeleton /> : <div className="grid grid-cols-4 gap-8">
            {products?.map(product => <Product key={product.id} product={product} />)}
        </div>}

    </div>
};

export default ProductTabs
