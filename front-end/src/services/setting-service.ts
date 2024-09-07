import { BaseResponse, DataResponse, ReviewShowResource, SlideShowResource } from "../resources";
import axiosConfig from '../configuration/axiosConfig';
import { ReviewShowRequest } from "../areas/admin/components/modals/CreateReviewShowModal";

class SettingService {
    getAllSlideShows() : Promise<DataResponse<SlideShowResource[]>> {
        return axiosConfig.get('/api/Setting/slide-show');
    }

    getAllReviewShows() : Promise<DataResponse<ReviewShowResource[]>> {
        return axiosConfig.get('/api/Setting/review-show');
    }

    createSlideShow(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/slide-show', payload)
    }

    editSlideShow(id: number | string, payload: FormData) : Promise<void> {
        return axiosConfig.put('/api/Setting/slide-show/'+ id, payload)
    }

    removeSlideShow(id: number | string) : Promise<void> {
        return axiosConfig.delete('/api/Setting/slide-show/' + id)
    }

    createReviewShow(payload: ReviewShowRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/review-show', payload)
    }

    removeReviewShow(id: number | string) : Promise<void> {
        return axiosConfig.delete('/api/Setting/review-show/' + id)
    }
}

const settingService = new SettingService();
export default settingService;