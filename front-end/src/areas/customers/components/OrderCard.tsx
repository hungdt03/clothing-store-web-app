import { Button, Image, Modal, Tag } from "antd";
import { FC } from "react";
import {
    EyeOutlined
} from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import OrderDetailsModal from "./modals/OrderDetailsModal";
import { OrderResource } from "../../../resources";
import { formatCurrencyVND, formatDateTime } from "../../../utils/format";

type OrderCardProps = {
    order: OrderResource
}

const OrderCard: FC<OrderCardProps> = ({
    order
}) => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();

    return <div className="flex items-center justify-between p-8 py-6 rounded-3xl border-[1px] border-gray-300">
        <div className="flex flex-1 flex-col gap-y-4 ">
            <div className="flex gap-x-1">
                <Tag color="volcano">{order.orderStatus}</Tag> |
                <span>{formatDateTime(new Date(order.createdAt.toString()))}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-x-2 items-center">
                    <Image className="rounded-lg object-cover" height='80px' width='80px' src={order.thumbnailUrl} />
                    <div className="flex text-sm flex-col gap-y-2">
                        <span className="font-semibold text-[16px]">ORDER ID: <b className="text-primary">{order.id}</b></span>
                        <p>{order.title}</p>
                        <p className="text-primary font-semibold">{formatCurrencyVND(order.totalPrice)}</p>
                    </div>
                </div>

            </div>
        </div>

        <Button
            onClick={showModal}
            icon={<EyeOutlined />}
        >
            Chi tiết
        </Button>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={<p className="text-center font-semibold text-2xl">CHI TIẾT ĐƠN HÀNG</p>}
            footer={[]}
            width='1000px'
        >
            <OrderDetailsModal orderId={order.id} />
        </Modal>
    </div>
};

export default OrderCard;
