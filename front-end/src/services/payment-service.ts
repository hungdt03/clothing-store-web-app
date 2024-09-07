import { CheckoutType } from '../areas/customers/pages/CheckoutPage';
import axiosConfig from '../configuration/axiosConfig';
import { DataResponse } from "../resources";

class PaymentService {

    createVnpayPaymentUrl(payload: CheckoutType) : Promise<DataResponse<string>> {
        return axiosConfig.post("/api/Payment/create-vnpay-payment", payload);
    }

    payPalCapture(orderId: string, payload: CheckoutType) : Promise<DataResponse<string>> {
        return axiosConfig.post("/api/Payment/capture/" + orderId, payload);
    }

}

const paymentService = new PaymentService();
export default paymentService;