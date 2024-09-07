import { CategoryRequest } from '../areas/admin/components/modals/CreateCategoryModal';
import { QueryParams } from '../areas/admin/pages/products/VariantManagement';
import axiosConfig from '../configuration/axiosConfig';
import { CategoryLevelResource, CategoryResource, DataResponse, PaginationResponse } from '../resources';

class CategoryService {

    getAllCategories(params?: QueryParams) : Promise<PaginationResponse<CategoryResource[]>> {
        const queryString = new URLSearchParams(params as any).toString();
        return axiosConfig.get("/api/Category?" + queryString);
    }

    getAllCategoriesByLevel() : Promise<DataResponse<CategoryLevelResource[]>> {
        return axiosConfig.get("/api/Category/level");
    }

    createCategory(payload: CategoryRequest) : Promise<DataResponse<CategoryResource>> {
        return axiosConfig.post("/api/Category", payload);
    }

    updateCategory(id: number, payload: CategoryRequest) : Promise<void> {
        return axiosConfig.put("/api/Category/" + id, payload);
    }

    removeCategory(id: number): Promise<void> {
        return axiosConfig.delete("/api/Category/" + id);
    }
}

const categoryService = new CategoryService();
export default categoryService;