import { Tag } from "antd";
import { OrderStatus, OrderStatusType } from "../constants/OrderStatus";

export function getOrderStatusTag(status: OrderStatusType) {
    switch (status) {
        case OrderStatus.WAITING_PAYMENT:
            return <Tag color="gold">{OrderStatus.WAITING_PAYMENT}</Tag>;
        case OrderStatus.PENDING:
            return <Tag color="orange">{OrderStatus.PENDING}</Tag>;
        case OrderStatus.CONFIRMED:
            return <Tag color="blue">{OrderStatus.CONFIRMED}</Tag>;
        case OrderStatus.REJECTED:
            return <Tag color="red">{OrderStatus.REJECTED}</Tag>;
        case OrderStatus.CANCELLED:
            return <Tag color="volcano">{OrderStatus.CANCELLED}</Tag>;
        case OrderStatus.DELIVERING:
            return <Tag color="cyan">{OrderStatus.DELIVERING}</Tag>;
        case OrderStatus.DELIVERED:
            return <Tag color="geekblue">{OrderStatus.DELIVERED}</Tag>;
        case OrderStatus.COMPLETED:
            return <Tag color="green">{OrderStatus.COMPLETED}</Tag>;
        default:
            return <Tag className="cursor-pointer">{status}</Tag>;
    }
}

export function getOrderStatusBtn(status: OrderStatusType) {
    switch (status) {
        case OrderStatus.WAITING_PAYMENT:
            return <Tag color="gold">{OrderStatus.WAITING_PAYMENT}</Tag>;
        case OrderStatus.PENDING:
            return <Tag color="orange">{OrderStatus.PENDING}</Tag>;
        case OrderStatus.CONFIRMED:
            return <Tag color="blue">Nhận đơn</Tag>;
        case OrderStatus.REJECTED:
            return <Tag color="red">Từ chối</Tag>;
        case OrderStatus.CANCELLED:
            return <Tag color="volcano">Hủy đơn</Tag>;
        case OrderStatus.DELIVERING:
            return <Tag color="cyan">Vận chuyển</Tag>;
        case OrderStatus.DELIVERED:
            return <Tag color="geekblue">{OrderStatus.DELIVERED}</Tag>;
        case OrderStatus.COMPLETED:
            return <Tag color="green">{OrderStatus.COMPLETED}</Tag>;
        default:
            return <Tag className="cursor-pointer">{status}</Tag>;
    }
}