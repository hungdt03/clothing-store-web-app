import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Button, Divider } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { selectCart } from "../../../../feature/cart/cartSlice";
import orderService from "../../../../services/order-service";
import Loading from "../../../shared/Loading";
import images from "../../../../assets";

type PaymentMethodModalProps = {
    onCashPayment: () => void;
    onVnpayPayment: () => void;
    onPaypalPayment: (orderId: string) => Promise<void>
}

export type CreateOrderPaypal = {
    totalPrice: number;
}

const PaymentMethodModal: FC<PaymentMethodModalProps> = ({
    onCashPayment,
    onVnpayPayment,
    onPaypalPayment
}) => {

    const { total } = useSelector(selectCart)
    const [{ isPending }] = usePayPalScriptReducer();

    const handleOnApprove = async (data: any, actions: any) => {
        onPaypalPayment(data.orderID)
    };

    const handleCreateOrder = async () => {
        const payload: CreateOrderPaypal = {
            totalPrice: total
        }
        const response = await orderService.creaeteOrderWithPaypal(payload)
        return response.id;
    };


    return <div className="flex flex-col p-4">
        {isPending && <Loading />}
        <Button onClick={onCashPayment} size="large">Thanh toán khi nhận hàng</Button>
        <Divider className="my-0" plain>Hoặc</Divider>
        <div className="flex items-center gap-x-5 w-full">
            <Button onClick={onVnpayPayment} size="large" icon={<img alt='ảnh vnpay' className="w-8 h-8 object-cover" src={images.vnpay} />} className="w-1/2">Thanh toán VNPAY</Button>
            <PayPalButtons
                className="w-1/2"
                createOrder={handleCreateOrder}
                onApprove={handleOnApprove}
                style={{
                    layout: "horizontal",
                    label: "pay",
                    height: 40,
                    color: 'silver',
                    tagline: false,
                    shape: "pill"
                }}
            />
        </div>
    </div>;
};

export default PaymentMethodModal;
