import { EditProductRequest } from '../areas/admin/components/modals/EditProductModal';
import { RemoveImagesRequest } from '../areas/admin/pages/products/ProductDetail';
import { QueryParams } from '../areas/admin/pages/products/VariantManagement';
import { ProductFilter } from '../areas/customers/pages/ShopPage';
import axiosConfig from '../configuration/axiosConfig';
import { DataResponse, PaginationResponse, ProductResource } from '../resources';

class ProductService {

    getAllProducts(params?: ProductFilter) : Promise<PaginationResponse<ProductResource[]>> {
        const queryUrls = [];

        if(params?.pageIndex) {
            queryUrls.push(`pageIndex=${params?.pageIndex}`)
        }

        if(params?.pageSize) {
            queryUrls.push(`pageSize=${params?.pageSize}`)
        }

        if(params?.minPrice) {
            queryUrls.push(`minPrice=${params?.minPrice}`)
        }

        if(params?.maxPrice) {
            queryUrls.push(`maxPrice=${params?.maxPrice}`)
        }

        if(params?.brandIds) {
            params.brandIds.forEach(param => {
                queryUrls.push(`brandIds=${param}`)
            })
        }

        if(params?.categoryIds) {
            params.categoryIds.forEach(param => {
                queryUrls.push(`categoryIds=${param}`)
            })
        }

        if(params?.sizeIds) {
            params.sizeIds.forEach(param => {
                queryUrls.push(`sizeIds=${param}`)
            })
        }

        if(params?.colorIds) {
            params.colorIds.forEach(param => {
                queryUrls.push(`colorIds=${param}`)
            })
        }

        if(params?.sortBy && params.sortOrder) {
            queryUrls.push(`sortBy=${params?.sortBy}`)
            queryUrls.push(`sortOrder=${params?.sortOrder}`)
        }

        return axiosConfig.get("/api/Product?" + queryUrls.join('&'));
    }

    getProductById(id: string | number) : Promise<DataResponse<ProductResource>> {
        return axiosConfig.get("/api/Product/" + id);
    }

    getTopFavoriteProducts() : Promise<DataResponse<ProductResource[]>> {
        return axiosConfig.get('/api/Product/top-favorites')
    }

    getTopBestSellerProducts() : Promise<DataResponse<ProductResource[]>> {
        return axiosConfig.get('/api/Product/top-best-sellers')
    }

    searchProducts(queryParams?: QueryParams) : Promise<PaginationResponse<ProductResource[]>> {
        const queryString = new URLSearchParams(queryParams as any).toString();
        return axiosConfig.get("/api/Product/search?" + queryString)
    }

    createProduct(payload: FormData) : Promise<DataResponse<ProductResource>> {
        return axiosConfig.post("/api/Product", payload);
    }

    updateProduct(id: number, payload: EditProductRequest) : Promise<void> {
        return axiosConfig.put("/api/Product/" + id, payload);
    }

    uploadThumbnail(id: number, payload: FormData) : Promise<void> {
        return axiosConfig.put("/api/Product/upload/thumbnail/" + id, payload);
    }

    uploadZoomImage(id: number, payload: FormData) : Promise<void> {
        return axiosConfig.put("/api/Product/upload/zoom-image/" + id, payload);
    }

    uploadImages(id: number, payload: FormData) : Promise<void> {
        return axiosConfig.put("/api/Product/upload/images/" + id, payload);
    }

    removeImages(payload: RemoveImagesRequest) : Promise<void> {
        return axiosConfig.put("/api/Product/remove-images", payload);
    }

    removeProduct(id: number): Promise<void> {
        return axiosConfig.delete("/api/Product/" + id);
    }
}

const productService = new ProductService();
export default productService;