import { EvaluationRequest } from '../areas/customers/components/OrderItem';
import axiosConfig from '../configuration/axiosConfig';
import { BaseResponse, DataResponse, EvaluationResource, PaginationResponse, ReportEvaluationResource } from "../resources";

class EvaluationService {

    getAllByProductId(productId: number | string) : Promise<PaginationResponse<ReportEvaluationResource>> {
        return axiosConfig.get("/api/Evaluation/" + productId);
    }

    getAllExcellentEvaluations() : Promise<DataResponse<EvaluationResource[]>> {
        return axiosConfig.get('/api/Evaluation/excellent')
    }

    createEvaluation(payload: EvaluationRequest) : Promise<BaseResponse> {
        return axiosConfig.post("/api/Evaluation", payload);
    }

    interactEvaluation(id: number): Promise<void> {
        return axiosConfig.put("/api/Evaluation/" + id)
    }
}

const evaluationService = new EvaluationService();
export default evaluationService;