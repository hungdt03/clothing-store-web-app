import { DataResponse, NotificationResource } from "../resources";
import axiosConfig from '../configuration/axiosConfig'

class NotificationService {
    getAllNotifications() : Promise<DataResponse<NotificationResource[]>> {
        return axiosConfig.get('/api/Notification')
    }
}

const notificationService = new NotificationService();
export default notificationService;