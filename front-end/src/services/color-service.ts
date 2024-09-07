import { ColorRequest } from '../areas/admin/components/modals/CreateColorModal';
import axiosConfig from '../configuration/axiosConfig';
import { ColorResource, DataResponse } from "../resources";

class ColorService {

    getAllColors() : Promise<DataResponse<ColorResource[]>> {
        return axiosConfig.get("/api/Color");
    }

    createColor(payload: ColorRequest) : Promise<DataResponse<ColorResource>> {
        return axiosConfig.post("/api/Color", payload);
    }

    updateColor(id: number, payload: ColorRequest) : Promise<void> {
        return axiosConfig.put("/api/Color/" + id, payload);
    }

    removeColor(id: number): Promise<void> {
        return axiosConfig.delete("/api/Color/" + id);
    }
}

const colorService = new ColorService();
export default colorService;