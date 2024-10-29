import { EditVariantRequest } from '../areas/admin/components/modals/EditVariantModal';
import { RemoveImagesRequest } from '../areas/admin/pages/products/VariantDetails';
import { QueryParams } from '../areas/admin/pages/products/VariantManagement';
import axiosConfig from '../configuration/axiosConfig';
import { DataResponse, PaginationResponse, VariantResource } from '../resources';

class VariantService {

    getAllVariants(params?: QueryParams): Promise<PaginationResponse<VariantResource[]>> {
        const queryString = new URLSearchParams(params as any).toString();
        return axiosConfig.get(`/api/Variant?${queryString}`);
    }

    getVariantById(id: number | string): Promise<DataResponse<VariantResource>> {
        return axiosConfig.get("/api/Variant/" + id);
    }

    getAllVariantsByProductId(productId: number | string, params?: QueryParams): Promise<PaginationResponse<VariantResource[]>> {
        const queryString = new URLSearchParams(params as any).toString();
        return axiosConfig.get("/api/Variant/product/" + productId + '/?' + queryString);
    }

    getAllVariantsByProductIdAndColorId(productId: number | string, colorId: number | string): Promise<DataResponse<VariantResource[]>> {
        return axiosConfig.get("/api/Variant/product/" + productId + "/" + colorId);
    }

    getUniqueColorVariantsByProductId(productId: number | string): Promise<DataResponse<VariantResource[]>> {
        return axiosConfig.get("/api/Variant/product-unique-color/" + productId);
    }

    getUniqueSizeVariantsByProductId(productId: number | string): Promise<DataResponse<VariantResource[]>> {
        return axiosConfig.get("/api/Variant/product-unique-size/" + productId);
    }

    createVariant(payload: FormData): Promise<DataResponse<VariantResource>> {
        return axiosConfig.post("/api/Variant", payload);
    }

    updateVariant(id: number, payload: EditVariantRequest): Promise<void> {
        return axiosConfig.put("/api/Variant/" + id, payload);
    }

    uploadThumbnail(id: number, payload: FormData): Promise<void> {
        return axiosConfig.put("/api/Variant/upload/thumbnail/" + id, payload);
    }

    uploadImages(id: number, payload: FormData): Promise<void> {
        return axiosConfig.put("/api/Variant/upload/images/" + id, payload);
    }

    removeImages(payload: RemoveImagesRequest): Promise<void> {
        return axiosConfig.put("/api/Variant/remove-images", payload);
    }

    removeVariant(id: number): Promise<void> {
        return axiosConfig.delete("/api/Variant/" + id);
    }
}

const variantService = new VariantService();
export default variantService;