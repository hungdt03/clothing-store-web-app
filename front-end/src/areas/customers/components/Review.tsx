import { Avatar, Button, Divider, Rate } from "antd";
import { MoreOutlined, LikeOutlined } from '@ant-design/icons';
import { FC } from "react";
import { EvaluationResource } from "../../../resources";
import { formatDateTime } from "../../../utils/format";
import evaluationService from "../../../services/evaluation-service";
import RequiredAuthentication from "./RequiredAuthentication";

type ReviewProps = {
    review: EvaluationResource;
    onInteract: () => void
}

const Review: FC<ReviewProps> = ({
    review,
    onInteract
}) => {

    const handleInteractEvaluation = async () => {
        await evaluationService.interactEvaluation(review.id);
        onInteract()
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
            <div className="flex gap-x-2 items-center">
                <Avatar />
                <span className="font-semibold">{review.user?.name}</span>
            </div>
            <div className="flex items-center gap-x-4">
                <Rate className="text-sm" disabled value={review.stars} count={5} />
                <span className="font-semibold">{review.stars}</span>
                <Button shape="circle" icon={<MoreOutlined />}></Button>
            </div>
        </div>
        <p>{review.content}</p>
        <div className="flex justify-between items-center">
            <RequiredAuthentication handleIfAuthenticated={handleInteractEvaluation}>
                <button className={`${review.isFavoriteIncludeMe && 'text-primary'} flex items-center gap-x-2 cursor-pointer`}>
                    <LikeOutlined />
                    <span>Hữu ích</span>
                    <span>{review.favorites}</span>
                </button>
            </RequiredAuthentication>
            <span className="text-[14px] text-gray-500">{formatDateTime(new Date(review.createdAt))}</span>
        </div>
        <Divider className="mt-0" />
    </div>
};

export default Review;
