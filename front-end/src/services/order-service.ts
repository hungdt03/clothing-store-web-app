import { CreateOrderPaypal } from '../areas/customers/components/modals/PaymentMethodModal';
import { CheckoutType } from '../areas/customers/pages/CheckoutPage';
import { OrderFilter } from '../areas/customers/pages/OrdersPage';
import axiosConfig from '../configuration/axiosConfig';
import { DataResponse, OrderResource, PaginationResponse } from "../resources";
import { CreateOrderResponse } from '../resources/paypal';

class OrderService {

    creaeteOrder(payload: CheckoutType): Promise<DataResponse<OrderResource>> {
        return axiosConfig.post("/api/Order", payload);
    }

    creaeteOrderWithPaypal(payload: CreateOrderPaypal): Promise<CreateOrderResponse> {
        return axiosConfig.post("/api/Order/paypal", payload);
    }

    getOrderById(id: number | string | undefined): Promise<DataResponse<OrderResource>> {
        return axiosConfig.get("/api/Order/" + id);
    }

    getAllOrdersByUser(params?: OrderFilter): Promise<PaginationResponse<OrderResource[]>> {
        const queryUrls = [];

        if (params?.pageIndex) {
            queryUrls.push(`pageIndex=${params?.pageIndex}`)
        }

        if (params?.pageSize) {
            queryUrls.push(`pageSize=${params?.pageSize}`)
        }

        if (params?.status) {
            queryUrls.push(`status=${params?.status}`)
        }

        return axiosConfig.get("/api/Order/user?" + queryUrls.join('&'));
    }

    getAllOrders(params?: OrderFilter): Promise<PaginationResponse<OrderResource[]>> {
        const queryString = new URLSearchParams(params as any).toString();
        return axiosConfig.get("/api/Order?" + queryString);
    }

    updateConfirmed(id: number): Promise<void> {
        return axiosConfig.put(`/api/Order/update/${id}/confirmed`);
    }

    updateRejected(id: number): Promise<void> {
        return axiosConfig.put(`/api/Order/update/${id}/rejected`);
    }

    updateDelivering(id: number): Promise<void> {
        return axiosConfig.put(`/api/Order/update/${id}/delivering`);
    }

    updateDelivered(id: number): Promise<void> {
        return axiosConfig.put(`/api/Order/update/${id}/delivered`);
    }
}

const orderService = new OrderService();
export default orderService;