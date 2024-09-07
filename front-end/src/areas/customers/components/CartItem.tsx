import { FC } from "react";
import QuantityButton from "./QuantityButton";
import { Button, Image, Popconfirm } from "antd";
import { CartItemResource } from "../../../resources";
import { useDispatch } from "react-redux";
import {  DeleteOutlined } from '@ant-design/icons';
import { AppDispatch } from "../../../app/store";
import { descreaseQuantity, increaseQuantity, removeItem } from "../../../feature/cart/cartSlice";
import { formatCurrencyVND } from "../../../utils/format";

type CartItemProps = {
    cartItem: CartItemResource;
}

const CartItem: FC<CartItemProps> = ({
    cartItem
}) => {

    const dispatch = useDispatch<AppDispatch>();

    return <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
            <Image preview={false} className="rounded-md object-cover" width='80px' height='80px' src={cartItem.variant?.thumbnailUrl} />
            <div className="flex text-sm flex-col gap-y-2">
                <span className="font-semibold text-[16px]">{cartItem.product?.name}</span>
                <span>Màu sắc: <b>{cartItem.variant?.color?.name}</b></span>
                <span>Kích cỡ: <b>{cartItem.variant?.size?.eSize}</b></span>
            </div>
        </div>

        <div className="flex gap-x-2">
            <span className="line-through">{formatCurrencyVND(cartItem.product?.oldPrice)}</span>
            <span className="font-semibold text-primary">{formatCurrencyVND(cartItem.product?.price)}</span>
        </div>

        <div className="flex gap-x-3 items-center">
            <span>Số lượng</span>
            <QuantityButton
                defaultValue={cartItem.quantity}
                onIncrease={_ => dispatch(increaseQuantity(cartItem.variant.id))}
                onDescrease={_ => dispatch(descreaseQuantity(cartItem.variant.id))}
            />
        </div>

        <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn muốn xóa sản phẩm khỏi giỏ hàng ư?"
            onConfirm={() => dispatch(removeItem(cartItem.variant.id))}
            okText="Có"
            cancelText="Không"
        >
            <Button size="small" icon={<DeleteOutlined />} type="primary" danger></Button>
        </Popconfirm>
    </div>
};

export default CartItem;
