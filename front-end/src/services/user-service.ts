
import { AccountRequest } from '../areas/admin/components/modals/CreateAccountModal';
import { EditAccountRequest } from '../areas/admin/components/modals/EditAccountModal';
import { QueryParams } from '../areas/admin/pages/products/VariantManagement';
import { ChangePasswordRequest, ProfileRequest } from '../areas/customers/pages/ProfilePage';
import { ResetPasswordRequest, ValidateTokenRequest } from '../areas/customers/pages/ResetPassword';
import axiosConfig from '../configuration/axiosConfig';
import { BaseResponse, DataResponse, PaginationResponse, UserContactResource, UserResource } from "../resources";

class AccountService {

    createAccount(payload: AccountRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Account/create-account', payload)
    }

    editAccount(id: string, payload: EditAccountRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Account/edit-account/' + id, payload)
    }

    getAllAccounts(queryParams?: QueryParams): Promise<PaginationResponse<UserResource[]>> {
        var queryString = new URLSearchParams(queryParams as any).toString()
        return axiosConfig.get('/api/Account?' + queryString);
    }

    getUserDetails() : Promise<DataResponse<UserResource>> {
        return axiosConfig.get("/api/Account/logged-user");
    }

    getUserById(id: string) : Promise<DataResponse<UserResource>> {
        return axiosConfig.get('/api/Account/' + id)
    }

    getAllExceptLoggedInUser() : Promise<DataResponse<UserContactResource[]>> {
        return axiosConfig.get("/api/Account/except-loggedIn-user");
    }

    getAllAdmins() : Promise<DataResponse<UserContactResource[]>> {
        return axiosConfig.get("/api/Account/admin");
    }

    changePassword(payload: ChangePasswordRequest) : Promise<BaseResponse> {
        return axiosConfig.post("/api/Account/change-password", payload)
    }

    requestResetPassword(email: string) : Promise<BaseResponse> {
        return axiosConfig.get("/api/Account/request-reset-password?email=" + email)
    }

    resetPassword(payload: ResetPasswordRequest) : Promise<BaseResponse> {
        return axiosConfig.post("/api/Account/reset-password", payload)
    }

    validateToken(payload: ValidateTokenRequest) : Promise<BaseResponse> {
        return axiosConfig.post("/api/Account/validate-token", payload)
    }

    updateProfile(payload: ProfileRequest) : Promise<DataResponse<UserResource>> {
        return axiosConfig.post("/api/Account/update-profile", payload);
    }

    uploadAvatar(payload: FormData) : Promise<DataResponse<UserResource>> {
        return axiosConfig.post("/api/Account/upload-avatar", payload);
    }

    uploadCoverImage(payload: FormData) : Promise<DataResponse<UserResource>> {
        return axiosConfig.post("/api/Account/upload-coverImage", payload);
    }

    lockAccount(userId: string) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Account/lock/' + userId)
    }

    unlock(userId: string) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Account/unlock/' + userId)
    }
}

const accountService = new AccountService();
export default accountService;