import { Button, Result } from "antd";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { AppDispatch } from "../../../app/store";
import { clearCart } from "../../../feature/cart/cartSlice";

const OrderSuccessPage: FC = () => {
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if(searchParams.get('orderId'))
            dispatch(clearCart())
    }, [searchParams])

    return <Result
        status="success"
        title="Thanh toán đơn hàng thành công!"
        subTitle={`Mã đơn hàng: ${searchParams.get('orderId')}`}
        extra={[
            <Link key="console" to="/">
                <Button type="primary">
                    Trang chủ
                </Button>
            </Link>,
        ]}
    />
};

export default OrderSuccessPage;
