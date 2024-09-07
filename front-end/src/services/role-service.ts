import axiosConfig from '../configuration/axiosConfig'
import { DataResponse, RoleResource } from '../resources';

class RoleService {
    getAllRoles() : Promise<DataResponse<RoleResource[]>> {
        return axiosConfig.get('/api/Role')
    }
}

const roleService = new RoleService();
export default roleService;