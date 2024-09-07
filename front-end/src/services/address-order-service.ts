import { CreateAddressOrderRequest } from '../areas/customers/components/modals/CreateAddressOrderModal';
import axiosConfig from '../configuration/axiosConfig';
import { AddressOrderResource, BaseResponse, DataResponse } from '../resources';

class AddressOrderService {

    getAllAddressOrders() : Promise<DataResponse<AddressOrderResource[]>> {
        return axiosConfig.get("/api/AddressOrder");
    }

    createAddressOrder(payload: CreateAddressOrderRequest) : Promise<DataResponse<AddressOrderResource>> {
        return axiosConfig.post("/api/AddressOrder", payload);
    }

    setStatusAddressOrder(id: number) : Promise<BaseResponse> {
        return axiosConfig.put("/api/AddressOrder/" + id);
    }

}

const addressOrderService = new AddressOrderService();
export default addressOrderService;