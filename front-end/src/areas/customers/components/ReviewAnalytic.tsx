import { Progress, Rate } from "antd";
import { FC, Fragment } from "react";
import { StarPercent } from "../../../resources";

type ReviewAnalyticProps = {
    starPercents: StarPercent[]
}

const ReviewAnalytic: FC<ReviewAnalyticProps> = ({
    starPercents
}) => {
    return <Fragment>
       
        {starPercents.map(star => <div key={star.star} className="flex items-center gap-x-2 w-full">
            <Rate className="text-sm" disabled defaultValue={1} count={1} />
            <span className="text-xs">{star.star}</span>
            <Progress strokeColor='green' percent={star.percent} showInfo={false} />
            <span className="font-semibold text-xs">{star.totalEvaluation}</span>
        </div>)}
        
        
    </Fragment>
};

export default ReviewAnalytic;
