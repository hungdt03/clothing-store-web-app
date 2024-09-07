import { SizeRequest } from '../areas/admin/components/modals/CreateSizeModal';
import axiosConfig from '../configuration/axiosConfig';
import { DataResponse, SizeResource } from "../resources";

class SizeService {

    getAllSizes() : Promise<DataResponse<SizeResource[]>> {
        return axiosConfig.get("/api/Size");
    }

    createSize(payload: SizeRequest) : Promise<DataResponse<SizeResource>> {
        return axiosConfig.post("/api/Size", payload);
    }

    updateSize(id: number, payload: SizeRequest) : Promise<void> {
        return axiosConfig.put("/api/Size/" + id, payload);
    }

    removeSize(id: number): Promise<void> {
        return axiosConfig.delete("/api/Size/" + id);
    }
}

const sizeService = new SizeService();
export default sizeService;