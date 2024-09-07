import { FC, useState } from "react";
import {
    MoreOutlined
} from '@ant-design/icons';
import { Button, Image, Popover, Rate, Tooltip, message } from "antd";
import { Input } from 'antd';
import { OrderItemResource } from "../../../resources";
import { formatCurrencyVND } from "../../../utils/format";
import evaluationService from "../../../services/evaluation-service";

const { TextArea } = Input;

const desc = ['Quá tệ', 'Tệ', 'Bình thường', 'Khá tốt', 'Rất tốt'];

type ReviewPopoverProps = {
    productId: number;
    onClose: () => void;
}

export type EvaluationRequest = {
    productId: number;
    content: string;
    stars: number;
}


const ReviewPopover: FC<ReviewPopoverProps> = ({
    productId,
    onClose
}) => {
    const [payload, setPayload] = useState<EvaluationRequest>({
        productId,
        stars: 5,
        content: ''
    });

    const resetForm = () => {
        setPayload({
            ...payload,
            content: '',
            stars: 5
        })
    }


    const onContentChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            content: target.value
        })
    };

    const onStarChange = (value: number) => {
        setPayload({
            ...payload,
            stars: value
        })
    };

    const handleSubmitEvaluation = async () => {
        const response = await evaluationService.createEvaluation(payload)
        if (response.success) {
            message.success(response.message)
            resetForm()
            onClose()
        }

    }

    return <div className="flex flex-col gap-y-4 p-2">
        <div className="flex flex-col gap-y-2 items-center">
            <p className="text-2xl font-semibold">Bạn cảm thấy sản phẩm này thế nào</p>
            <p>Hãy để lại đánh giá để chúng tôi biết suy nghĩ của bạn về sản phẩm này</p>
        </div>
        <Rate className="text-center" tooltips={desc} onChange={onStarChange} value={payload.stars} />
        <TextArea placeholder="Để lại đánh giá của bạn ở đây ..." value={payload.content} allowClear onChange={onContentChange} />
        <div className="text-right">
            <Button onClick={handleSubmitEvaluation} disabled={!payload.content} type="primary">Đánh giá</Button>
        </div>
    </div>
}

type OrderItemProps = {
    orderItem: OrderItemResource;
    finished: boolean
}

const OrderItem: FC<OrderItemProps> = ({
    orderItem,
    finished
}) => {

    const [popoverVisible, setPopoverVisible] = useState(false);

    const orderMoreAction = () => <div className="flex flex-col gap-y-2 py-2">
        {finished && <Popover open={popoverVisible}
            onOpenChange={setPopoverVisible}
            trigger='click'
            content={<ReviewPopover onClose={() => setPopoverVisible(false)} productId={orderItem.productId!} />}
            placement="left"
        >
            <span className="cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100">Đánh giá sản phẩm</span>
        </Popover>}

        <span className="cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100">Các đánh giá của bạn</span>
    </div>

    return <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
            <Image className="rounded-md object-cover" width='60px' height='60px' src={orderItem.variant?.thumbnailUrl} />
            <div className="flex text-sm flex-col gap-y-1">
                <span className="font-semibold text-[16px]">{orderItem.productName}</span>
                <div className="flex gap-x-3">
                    <span>Màu sắc: <b>{orderItem.variant?.color.name}</b></span>
                    <span>Kích cỡ: <b>{orderItem.variant?.size.eSize}</b></span>
                </div>
                <div className="flex gap-x-1">
                    <span>{orderItem.quantity}</span>
                    <span className="text-gray-600">x</span>
                    <span>{formatCurrencyVND(orderItem.price)}</span>
                </div>
            </div>
        </div>

        <span className="font-semibold text-sm text-primary">{formatCurrencyVND(orderItem.subTotal)}</span>

        <Tooltip title='Đánh giá' placement="top">
            <Popover trigger='click' content={orderMoreAction} placement="bottom">
                <Button
                    className="rotate-90"
                    shape="circle"
                    size="small"
                    icon={<MoreOutlined />}
                ></Button>
            </Popover>
        </Tooltip>
    </div>
};

export default OrderItem;
