import { FC, useEffect, useState } from "react";
import { Button, Dropdown, Segmented, Table, Tooltip, message } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import CardBorder from "../../components/CardBorder";
import { OrderResource } from "../../../../resources";
import orderService from "../../../../services/order-service";
import { Link } from "react-router-dom";
import { formatCurrencyVND, formatDateTime } from "../../../../utils/format";
import { OrderStatus, OrderStatusType } from "../../../../constants/OrderStatus";
import { getOrderStatusBtn, getOrderStatusTag } from "../../../../utils/orderStatus";
import { OrderFilter } from "../../../customers/pages/OrdersPage";
import TitleHeader from "../../components/TitleHeader";
import useDebounce from "../../../../hooks/useDebounce";

const initialValues: OrderFilter = {
    pageIndex: 1,
    pageSize: 6,
    name: ''
}

const OrderManagement: FC = () => {
    const [params, setParams] = useState<OrderFilter>(initialValues)
    const [orders, setOrders] = useState<OrderResource[]>([])
    const [total, setTotal] = useState(6)
    const debounceValue = useDebounce(params.name, 600)

    const fetchOrders = async (queryParams: OrderFilter) => {
        const response = await orderService.getAllOrders(queryParams);
        setOrders(response.data);
        setTotal(response.pagination.totalItems)
    }

    useEffect(() => {
        fetchOrders(params);
    }, [debounceValue, params])


    const getStatusItems = (status: OrderStatusType, id: number): MenuProps['items'] => {
        if (status === OrderStatus.CANCELLED || status === OrderStatus.REJECTED || status === OrderStatus.COMPLETED || status === OrderStatus.DELIVERED)
            return undefined;

        if (status === OrderStatus.WAITING_PAYMENT)
            return [{
                key: OrderStatus.REJECTED,
                label: <button>{getOrderStatusBtn(OrderStatus.REJECTED)}</button>
            }]

        if (status === OrderStatus.PENDING)
            return [{
                key: OrderStatus.CONFIRMED,
                label: <button onClick={() => updateStatusOrder(orderService.updateConfirmed, id)}>{getOrderStatusBtn(OrderStatus.CONFIRMED)}</button>
            }, {
                key: OrderStatus.REJECTED,
                label: <button onClick={() => updateStatusOrder(orderService.updateRejected, id)} >{getOrderStatusBtn(OrderStatus.REJECTED)}</button>
            }]

        if (status === OrderStatus.CONFIRMED)
            return [{
                key: OrderStatus.DELIVERING,
                label: <button onClick={() => updateStatusOrder(orderService.updateDelivering, id)}>{getOrderStatusBtn(OrderStatus.DELIVERING)}</button>
            }]

        if (status === OrderStatus.DELIVERING)
            return [{
                key: OrderStatus.DELIVERED,
                label: <button onClick={() => updateStatusOrder(orderService.updateDelivered, id)}>{getOrderStatusBtn(OrderStatus.DELIVERED)}</button>
            }]
    }

    const updateStatusOrder = async (callback: (id: number) => Promise<void>, id: number) => {
        try {
            await callback(id);
            fetchOrders(params)
        } catch (error) {
            message.error('Cập nhật đơn hàng thất bại');
        }
    };


    const columns: TableProps<OrderResource>['columns'] = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Người đặt',
            dataIndex: 'user',
            key: 'user',
            render(_, { user }) {
                return <Link to={`/admin/account/${user.id}`}>{user.name}</Link>
            },
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render(_, { createdAt }) {
                return <span>{formatDateTime(new Date(createdAt))}</span>
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render(_, { totalPrice }) {
                return <span>{formatCurrencyVND(totalPrice)}</span>
            },
        },
        {
            title: 'Trạng thái',
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            render: (_, { orderStatus, id }) => (
                <Dropdown
                    trigger={['click']}
                    arrow
                    menu={{ items: getStatusItems(orderStatus as OrderStatusType, id), }}
                    placement="bottom"
                >
                    {
                        (orderStatus === OrderStatus.CANCELLED || orderStatus === OrderStatus.REJECTED || orderStatus === OrderStatus.COMPLETED || orderStatus === OrderStatus.DELIVERED) ?
                            <button disabled className="cursor-default">{getOrderStatusTag(orderStatus as OrderStatusType)}</button> :
                            <Tooltip placement="top" title='Ấn vào để thay đổi trạng thái'>
                                <button className="cursor-pointer">{getOrderStatusTag(orderStatus as OrderStatusType)}</button>
                            </Tooltip>
                    }

                </Dropdown >
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Link to={`/admin/order/${record.id}`}><Button icon={<EyeOutlined />} type="default" size="small">Chi tiết</Button></Link>
            ),
        },
    ];

    return <div className="flex flex-col gap-y-4">
        <CardBorder padding={2}>
            <div className="flex justify-center">
                <Segmented
                    options={[
                        { label: 'Tất cả', value: OrderStatus.ALL },
                        { label: 'Đang chờ', value: OrderStatus.PENDING },
                        { label: 'Đã xác nhận', value: OrderStatus.CONFIRMED },
                        { label: 'Đang vận chuyển', value: OrderStatus.DELIVERING },
                        { label: 'Đã giao', value: OrderStatus.DELIVERED },
                        { label: 'Đã hoàn thành', value: OrderStatus.COMPLETED },
                    ]}
                    onChange={(value) => {
                        setParams({
                            ...params,
                            status: value
                        })
                    }}

                />
            </div>
        </CardBorder>
        <CardBorder>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                title={() => <TitleHeader onChange={value => {
                    setParams({
                        ...params,
                        name: value
                    })
                }} value={params.name} isShowBtnTitle={false} title="Đơn hàng" />}
                pagination={total <= params.pageSize ? false : {
                    current: params.pageIndex,
                    align: 'end',
                    onChange: (value) => setParams({
                        ...params,
                        pageIndex: value
                    }),
                    pageSize: params.pageSize,
                    total: total,
                    showLessItems: true,
                }}
            />
        </CardBorder>

    </div>
};

export default OrderManagement;
