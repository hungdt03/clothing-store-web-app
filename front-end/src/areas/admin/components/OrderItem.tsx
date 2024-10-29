import { Image } from "antd";
import { FC } from "react";

import { OrderItemResource } from "../../../resources";
import { formatCurrencyVND } from "../../../utils/format";
import images from "../../../assets";

type OrderItemProps = {
    orderItem: OrderItemResource
}

const OrderItem: FC<OrderItemProps> = ({
    orderItem
}) => {
    return <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
            <Image onError={(e) => {
                e.currentTarget.src = images.demoMenth;
            }} className="rounded-md object-cover" width='80px' height='80px' src={orderItem.variant?.thumbnailUrl} />
            <div className="flex text-sm flex-col gap-y-2">
                <span className="font-semibold text-[16px]">{orderItem.productName}</span>
                <div className="flex gap-x-3">
                    <span>Màu sắc: <b>{orderItem.variant?.color.name}</b></span>
                    <span>Kích cỡ: <b>{orderItem.variant?.size.eSize}</b></span>
                </div>
            </div>
        </div>

        <div className="flex gap-x-1 items-center">
            <span className="font-semibold text-[14px]">{formatCurrencyVND(orderItem.variant?.product.price)}</span>
            <span className="text-gray-600">x {orderItem.quantity}</span>
        </div>

        <div className="flex gap-x-3 items-center">
            <span className="font-semibold text-[16px]">{formatCurrencyVND(orderItem.subTotal)}</span>
        </div>
    </div>
};

export default OrderItem;
