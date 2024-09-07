import { FC, useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import { OrderResource } from "../../../resources";
import orderService from "../../../services/order-service";
import OrderStatusGroup from "../components/OrderStatusGroup";
import { OrderStatusType } from "../../../constants/OrderStatus";
import { Empty, Pagination } from "antd";

export type OrderFilter = {
    pageIndex: number;
    pageSize: number;
    status?: string;
    name?: string;
}

const initialValues: OrderFilter = {
    pageIndex: 1,
    pageSize: 10,
}

const OrdersPage: FC = () => {
    const [orders, setOrders] = useState<OrderResource[]>([])
    const [params, setParams] = useState<OrderFilter>(initialValues)
    const [totalPages, setTotalPages] = useState(0)

    const fetchOrders = async (queryParams: OrderFilter) => {
        const response = await orderService.getAllOrdersByUser(queryParams);
        setTotalPages(response.pagination.totalPages)
        setOrders(response.data)
    }

    useEffect(() => {
        fetchOrders(params)
    }, [params])

    const handleChange = (status: OrderStatusType) => {
        const updateParams = {
            ...params,
            status
        }
        setParams(updateParams);
    }

    return <div className="flex flex-col">
        <OrderStatusGroup onChange={handleChange} />

        <div className="flex flex-col gap-y-4">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
            {orders.length === 0 ?
                <div className="p-8 flex items-center justify-center">
                    <Empty description='Không có đơn hàng nào' />
                </div>
                :
                <div className="mt-4 flex justify-center">
                    <Pagination current={params.pageIndex} onChange={(value) => {
                        const updateParams = {
                            ...params,
                            pageIndex: value
                        }
                        setParams(updateParams)
                    }} showLessItems pageSize={params.pageSize} total={totalPages} />
                </div>
            }
        </div>
    </div>;
};

export default OrdersPage;
