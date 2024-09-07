export const OrderStatus = {
    WAITING_PAYMENT: "Chờ thanh toán",
    ALL: "Tất cả",
    PENDING: "Đang chờ",
    CONFIRMED: "Đã xác nhận",
    REJECTED: "Đã hủy",
    CANCELLED: "Đã từ chối",
    DELIVERING: "Đang vận chuyển",
    DELIVERED: "Đã giao",
    COMPLETED: "Đã hoàn thành"
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

