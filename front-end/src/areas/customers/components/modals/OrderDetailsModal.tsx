import { Divider, Steps } from "antd";
import { FC, useEffect, useState } from "react";
import OrderItem from "../OrderItem";
import { OrderProcessItem, OrderResource } from "../../../../resources";
import orderService from "../../../../services/order-service";
import { formatCurrencyVND, formatDateTime } from "../../../../utils/format";
import { OrderStatus, OrderStatusType } from "../../../../constants/OrderStatus";

type OrderDetailsModalProps = {
    orderId: number
}

export const getStepProcess = (steps: OrderProcessItem[] | undefined): number => {
    return steps?.filter(step => step.isCompleted).length! - 1;
}

export const getStepsList = (steps: OrderProcessItem[] | undefined) => {
    return steps?.map(step => ({
        title: step.orderStatus,
        description: step.modifyAt && formatDateTime(new Date(step.modifyAt)),
    }))
}


const OrderDetailsModal: FC<OrderDetailsModalProps> = ({
    orderId
}) => {
    const [order, setOrder] = useState<OrderResource | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            const response = await orderService.getOrderById(orderId);
            setOrder(response.data)
        }

        fetchOrder();
    }, [orderId])

    return <div className="flex flex-col max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4 px-4">
        <div className="text-lg">
            <Divider orientation="left" plain>
                <span className="text-[16px]">Tiến trình</span>
            </Divider>
            {order && <Steps
                size="small"
                current={getStepProcess(order?.orderSteps)}
                items={getStepsList(order?.orderSteps)}
            />}


        </div>
        <div className="text-lg">
            <Divider orientation="left" plain>
                <span className="text-[16px]">Chi tiết</span>
            </Divider>
            <div className="flex flex-col gap-y-4">
                {order?.items.map(item => <OrderItem
                    finished={order.orderStatus as OrderStatusType === OrderStatus.DELIVERED || order.orderStatus as OrderStatusType === OrderStatus.COMPLETED}
                    key={item.id}
                    orderItem={item} />
                )}

            </div>
            <Divider />
            <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-9 text-[16px]">
                    <table border={1} className="border-collapse border-gray-300 border-[1px] w-full">
                        <tr className="border-b border-gray-300">
                            <td className="p-2 border-r border-gray-300">
                                <span>Giao hàng tới</span>
                            </td>
                            <td className="p-2">
                                <div className="flex flex-col">
                                    <span className="flex flex-col">
                                        <span className="font-semibold">{order?.addressOrder.fullName} </span>
                                        <span>(Email: {order?.addressOrder.email} - SĐT: {order?.addressOrder.phoneNumber})</span>
                                    </span>
                                    <p>Đ/C: {order?.addressOrder.address}</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2 border-r border-gray-300">
                                <span>Ghi chú</span>
                            </td>
                            <td className="p-2">
                                <p>{order?.note}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="flex col-span-3 text-[16px] flex-col gap-y-1">
                    <div className="flex items-center justify-between">
                        <span>Thành tiền</span>
                        <span>{formatCurrencyVND(order?.totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Phí ship</span>
                        <span>0VNĐ</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="text-lg font-semibold flex items-center justify-between">
                        <span>Tổng tiền</span>
                        <span className="text-primary">{formatCurrencyVND(order?.totalPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export default OrderDetailsModal;
