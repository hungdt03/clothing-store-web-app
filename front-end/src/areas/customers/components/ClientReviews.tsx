import { FC, useEffect, useState } from "react";
import { Rate } from "antd";
import {  ReviewShowResource } from "../../../resources";
import settingService from "../../../services/setting-service";

const ClientReviews: FC = () => {
    const [evaluations, setEvaluations] = useState<ReviewShowResource[]>([])

    const fetchEvaluations = async () => {
        const response = await settingService.getAllReviewShows();
        setEvaluations(response.data)
    }

    useEffect(() => {
        fetchEvaluations()
    }, [])

    return <div className="flex flex-col items-center gap-y-8 px-10">
        <span className="text-xl font-semibold">Đánh giá của khách hàng</span>
        <div className="w-full grid grid-cols-3 gap-8">
            {evaluations?.map(reviewShow => <div key={reviewShow.evaluation.id} className="rounded-2xl shadow px-4 py-6 flex flex-col gap-y-3 items-center">
                <img alt='Ảnh minh họa' src={reviewShow.evaluation.user?.avatar} width='120px' height='120px' className="object-cover rounded-full p-[2px] border-[3px] border-slate-100" />
                <span className="text-lg font-semibold">{reviewShow.evaluation.user?.name}</span>
                <p className="text-lg font-thin text-gray-400">Developer</p>
                <p className="line-clamp-3 text-lg text-gray-500 text-center">{reviewShow.evaluation.content}</p>
                <Rate count={5} disabled value={reviewShow.evaluation.stars} className="text-sm" />
            </div>)}
        </div>
    </div>
};

export default ClientReviews;
