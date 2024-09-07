import axiosConfig from '../configuration/axiosConfig';
import { DataResponse, OrderReport, OrderReportByMonth, ProductReport, ReportResource } from "../resources";

class ReportService {
    getReportData() : Promise<DataResponse<ReportResource>> {
        return axiosConfig.get("/api/Report");
    }

    getOrderPercentInRangeYear(year: number | string) : Promise<DataResponse<OrderReport[]>> {
        return axiosConfig.get("/api/Report/order/year?year=" + year);
    }

    getOrderByMonth(month?: Date) : Promise<DataResponse<OrderReportByMonth[]>> {
        console.log('Month: ', month?.toISOString())
        return axiosConfig.get("/api/Report/order/month?month=" + month?.toISOString());
    }

    getTopFiveBestSellerProducts(fromTime?: Date, toTime?: Date) : Promise<DataResponse<ProductReport[]>> {
        return axiosConfig.get('/api/Report/top-product?fromTime=' + fromTime + "&toTime=" + toTime);
    }

}

const reportService = new ReportService();
export default reportService;