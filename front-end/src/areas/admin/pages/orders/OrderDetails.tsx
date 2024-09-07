import { FC, useEffect, useState } from "react";
import CardBorder from "../../components/CardBorder";
import { UserOutlined } from '@ant-design/icons';
import { Divider, Empty, Steps, Tag, Tooltip } from "antd";
import OrderItem from "../../components/OrderItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCode, faLocationArrow, faMessage, faPhone, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import orderService from "../../../../services/order-service";
import { OrderResource } from "../../../../resources";
import { formatCurrencyVND, formatDateTime } from "../../../../utils/format";
import { getStepProcess, getStepsList } from "../../../customers/components/modals/OrderDetailsModal";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { getOrderStatusTag } from "../../../../utils/orderStatus";
import { OrderStatusType } from "../../../../constants/OrderStatus";

const OrderDetails: FC = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderResource>();

    useEffect(() => {
        const fetchOrder = async () => {
            const response = await orderService.getOrderById(id);
            setOrder(response.data);
        }

        fetchOrder();
    }, [id])

    return <div className="flex flex-col gap-y-4">
        <CardBorder padding={4}>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col">
                    <div className="flex gap-x-3 items-baseline">
                        <span className="text-2xl font-semibold">MÃ ĐƠN HÀNG: {order?.id}</span>
                        <span>{getOrderStatusTag(order?.orderStatus as OrderStatusType)}</span>
                    </div>
                    <p>Được tạo vào lúc {formatDateTime(new Date(order?.createdAt!))}</p>
                </div>

                {order && <Steps
                    size="small"
                    current={getStepProcess(order?.orderSteps)}
                    items={getStepsList(order?.orderSteps)}
                />}
            </div>
        </CardBorder>

        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 flex flex-col gap-y-4">
                <CardBorder padding={4}>
                    <span className="text-xl font-semibold">Ghi chú</span>
                    {order?.note ? <p>{order?.note}</p> : <Empty description='Không có ghi chú nào' />}
                </CardBorder>
                <CardBorder padding={4}>
                    <p className="text-xl font-semibold mb-4">Các sản phẩm</p>
                    <div className="flex flex-col gap-y-4">
                        {order?.items.map(orderItem => <OrderItem key={orderItem.id} orderItem={orderItem} />)}

                    </div>
                    <Divider className="my-4" />
                    <div className="flex flex-col gap-y-1">
                        <div className="flex items-center justify-between">
                            <span>Thành tiền</span>
                            <span>{formatCurrencyVND(order?.totalPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Phí ship</span>
                            <span>{formatCurrencyVND(0)}</span>
                        </div>
                        <div className="text-lg font-semibold flex items-center justify-between">
                            <span>Tổng tiền</span>
                            <span>{formatCurrencyVND(order?.totalPrice)}</span>
                        </div>
                    </div>
                </CardBorder>


            </div>
            <div className="col-span-4 flex flex-col gap-y-4">

                <CardBorder padding={4}>
                    <p className="text-xl font-semibold mb-4">Thông tin khách hàng</p>
                    <div className="flex flex-col gap-y-3">
                        <div className="flex items-center gap-x-3">
                            <UserOutlined />
                            <span>{order?.addressOrder.fullName}</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <FontAwesomeIcon icon={faLocationArrow} />
                            <span>{order?.addressOrder.address}</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <FontAwesomeIcon icon={faPhone} />
                            <span>{order?.addressOrder.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <FontAwesomeIcon icon={faMessage} />
                            <span>{order?.addressOrder.email}</span>
                        </div>
                    </div>
                </CardBorder>
                <CardBorder padding={4}>
                    <p className="text-xl font-semibold mb-3">Thông tin thanh toán</p>
                    <div className="flex flex-col gap-y-3">
                        <Tooltip placement="left" title='Thời gian thanh toán'>
                            <div className="flex items-center gap-x-3">
                                <FontAwesomeIcon icon={faCalendar} />
                                <span>{formatDateTime(new Date(order?.payment.createdDate!))}</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="left" title='Mã giao dịch'>
                            <div className="flex items-center gap-x-3">
                                <FontAwesomeIcon icon={faCode} />
                                <span>{order?.payment.paymentCode}</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="left" title='Phương thức thanh toán'>
                            <div className="flex items-center gap-x-3">
                                <FontAwesomeIcon icon={faPaypal} />
                                <span>{order?.payment.paymentMethod === "CASH" ? 'Thanh toán khi nhận hàng' : order?.payment.paymentMethod}</span>
                            </div>
                        </Tooltip>

                        <Tooltip placement="left" title='Trạng thái'>
                            <div className="flex items-center gap-x-3">
                                <FontAwesomeIcon icon={faQuestion} />
                                <Tag color="pink">{order?.payment.status ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag>
                            </div>
                        </Tooltip>


                    </div>
                </CardBorder>
            </div>
        </div>
    </div>
};

export default OrderDetails;
