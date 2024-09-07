import { FC, Fragment, useEffect, useState } from "react";
import Footer from "../../../layouts/shared/Footer";
import HeaderFadeIn from "../../../layouts/shared/HeaderFadeIn";
import Header from "../../../layouts/shared/Header";
import { Breadcrumb, Button, Divider, Empty, Form, FormProps, Image, Input, Modal, Radio, message, } from "antd";
import CardBorder from "../../admin/components/CardBorder";
import QuantityButton from "../components/QuantityButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { clearCart, descreaseQuantity, increaseQuantity, selectCart } from "../../../feature/cart/cartSlice";
import { AddressOrderResource, CartItemResource } from "../../../resources";
import useModal from "../../../hooks/useModal";
import PaymentMethodModal from "../components/modals/PaymentMethodModal";
import addressOrderService from "../../../services/address-order-service";
import orderService from "../../../services/order-service";
import paymentService from "../../../services/payment-service";
import { PlusOutlined } from '@ant-design/icons';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../utils/format";
import AddressRadioItem from "../components/AddressRadioItem";


type CartItemProps = {
    cartItem: CartItemResource
}

const CartItem: FC<CartItemProps> = ({
    cartItem
}) => {
    const dispatch = useDispatch<AppDispatch>();


    return <div className="flex items-center justify-between">
        <div className="flex gap-x-3 items-center">
            <Image width='60px' height='60px' className="object-cover rounded-xl" src={cartItem.variant?.thumbnailUrl} />
            <div className="flex flex-col text-[13px]">
                <span className="font-semibold text-sm">{cartItem.product.name}</span>
                <span className="text-gray-600">{cartItem.variant?.color?.name} | {cartItem.variant?.size?.eSize}</span>
                <div className="flex gap-x-1">
                    <p className="font-semibold text-primary">{formatCurrencyVND(cartItem.price)}</p>
                    <span className="text-gray-600">x {cartItem.quantity}</span>
                </div>
            </div>
        </div>

        <p className="font-semibold text-primary text-sm">{formatCurrencyVND(cartItem.subTotal)}</p>

        <QuantityButton onDescrease={_ => dispatch(descreaseQuantity(cartItem.variant?.id))} onIncrease={_ => dispatch(increaseQuantity(cartItem.variant?.id))} size='small' defaultValue={cartItem.quantity} />
    </div>
}

type OrderItemPayload = {
    variantId: number;
    quantity: number;
}

export type CheckoutType = {
    addressOrderId: number;
    note?: string;
    items?: OrderItemPayload[]
};

const initialOptions = {
    "clientId": "AdcXiG8g6m1ciOeYYXzaruVMrUC9ePt_bUQfA_omuLcY2W7WRzpyRxJsh-HWrqLPUQZMD_dDF3x6lpRl",
    currency: "USD",
    intent: "capture",
};


const CheckoutPage: FC = () => {
    const [fixed, setFixed] = useState(false)
    const { cartItems, total } = useSelector(selectCart)
    const [addressOrders, setAddressOrders] = useState<AddressOrderResource[]>([])
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();
    const [form] = Form.useForm<CheckoutType>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = event.currentTarget.scrollTop;
        if (scrollTop >= 96) {
            setFixed(true)
        } else if (scrollTop === 0) {
            setFixed(false)
        }

    }

    useEffect(() => {
        const fetchAddressOrders = async () => {
            const response = await addressOrderService.getAllAddressOrders();
            setAddressOrders(response.data)
            const defaultValue = response.data.find(item => item.isDefault)?.id!
            form.setFieldsValue({
                addressOrderId: defaultValue
            });
        }

        fetchAddressOrders()
    }, [])

    const onFinish: FormProps<CheckoutType>['onFinish'] = (_) => {
        showModal()
    };

    const onFinishFailed: FormProps<CheckoutType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCreateOrder = async () => {
        const items = cartItems.map(item => ({
            quantity: item.quantity,
            variantId: item.variant.id
        } as OrderItemPayload))

        const payload: CheckoutType = {
            ...form.getFieldsValue(),
            items: items
        }

        const response = await orderService.creaeteOrder(payload);
        if (response.success) {
            message.success(response.message)
            handleOk();
            dispatch(clearCart())
            navigate(`/result/order-success?orderId=${response.data.id}`)
        }
    }

    const handleCreateVnpayPayment = async () => {
        const items = cartItems.map(item => ({
            quantity: item.quantity,
            variantId: item.variant.id
        } as OrderItemPayload))

        const payload: CheckoutType = {
            ...form.getFieldsValue(),
            items: items
        }
        const response = await paymentService.createVnpayPaymentUrl(payload);
        if (response.success) {
            window.open(response.data, '_blank');
        }
    }

    const handlePaypalPayment = async (orderId: string) => {
        const items = cartItems.map(item => ({
            quantity: item.quantity,
            variantId: item.variant.id
        } as OrderItemPayload))

        const payload: CheckoutType = {
            ...form.getFieldsValue(),
            items: items
        }

        const response = await paymentService.payPalCapture(orderId, payload);
        if (response.success) {
            message.success(response.message)
            handleOk()
            dispatch(clearCart())
        }

    }

    return <div onScroll={handleScroll} className="flex flex-col h-screen overflow-y-auto bg-slate-50">
        <HeaderFadeIn fixed={fixed} />
        <Header />
        <div className="bg-slate-50 px-10">
            <Breadcrumb
                className="my-10 text-[17px]"
                separator=">"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Checkout',
                        href: '',
                    }
                ]}
            />
            {
                cartItems.length > 0 ?
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="col-span-8 flex flex-col">
                            <CardBorder>
                                <Form
                                    name="basic"
                                    form={form}
                                    onFinish={onFinish}
                                    initialValues={{
                                        note: '',
                                        items: []
                                    }}
                                    layout="vertical"
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item<CheckoutType>
                                        label="Chọn địa chỉ"
                                        name="addressOrderId"
                                        rules={[{ required: true, message: 'Vui lòng chọn địa chỉ giao hàng!' }]}
                                    >
                                        {
                                            addressOrders.length > 0 ?
                                                <Radio.Group className="flex flex-col gap-y-5">
                                                    {addressOrders.map(address => <Radio className="bg-slate-50 w-full px-4 py-2 rounded-lg" key={address.id} value={address.id}>
                                                        <AddressRadioItem address={address} />
                                                    </Radio>)}

                                                    <div>
                                                        <Divider className="mb-2 mt-0" plain>Hoặc</Divider>
                                                        <Link to="/account/address-order">
                                                            <Button icon={<PlusOutlined />} size="large">Địa chỉ khác</Button>
                                                        </Link>
                                                    </div>
                                                </Radio.Group>

                                                : <div className="flex flex-col gap-y-8">
                                                    <Empty description='Bạn chưa có địa chỉ giao hàng nào' />
                                                    <Link to='/account/address-order' className="w-full text-center">
                                                        <Button type="primary">Tới trang tạo địa chỉ</Button>
                                                    </Link>
                                                </div>

                                        }
                                    </Form.Item>

                                    <Form.Item<CheckoutType>
                                        label="Ghi chú cho shop"
                                        name="note"
                                    >
                                        <Input.TextArea size='large' />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button disabled={total === 0} size="large" type="primary" htmlType="submit">
                                            Tiếp tục
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </CardBorder>
                        </div>
                        <div className="col-span-4 flex flex-col">
                            <CardBorder className="border-[1px] border-gray-100">
                                <div className="flex flex-col gap-y-4 mb-4">
                                    {cartItems.map(cartItem => <Fragment key={cartItem.variant.id}>
                                        <CartItem cartItem={cartItem} />
                                        <Divider className="my-1" />
                                    </Fragment>)}
                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Thành tiền</span>
                                        <span className="text-gray-400 font-semibold">{formatCurrencyVND(total)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Phí ship</span>
                                        <span className="text-gray-400 font-semibold">{formatCurrencyVND(0)}</span>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex items-center justify-between font-semibold">
                                    <span className="text-gray-400">Tổng tiền</span>
                                    <span className="text-primary">{formatCurrencyVND(total)}</span>
                                </div>

                                <Divider className="my-4" />

                            </CardBorder>
                        </div>

                        <Modal
                            open={isModalOpen}
                            onOk={handleOk}
                            title={<p className="text-center font-semibold text-2xl">PHƯƠNG THỨC THANH TOÁN</p>}
                            onCancel={handleCancel}
                            footer={[]}
                        >

                            <PayPalScriptProvider deferLoading={false} options={initialOptions}>
                                <PaymentMethodModal onPaypalPayment={handlePaypalPayment} onVnpayPayment={handleCreateVnpayPayment} onCashPayment={handleCreateOrder} />
                            </PayPalScriptProvider>

                        </Modal>
                    </div>
                    : <div className="flex flex-col gap-y-14">
                        <Empty className="text-2xl" description='Chưa có sản phẩm nào trong giỏ hàng' />
                        <Link to='/shop' className="w-full text-center">
                            <Button shape="round" size="large" type="primary">
                                MUA SẮM NGAY
                            </Button>
                        </Link>
                    </div>}

        </div>

        <Footer />
    </div>
};

export default CheckoutPage;
