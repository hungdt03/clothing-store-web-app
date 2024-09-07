import { GoogleAuthorizeType, SignInRequest } from '../areas/customers/components/modals/LoginModal';
import { SignUpRequest } from '../areas/customers/components/modals/RegisterModal';
import axiosConfig from '../configuration/axiosConfig';
import { AuthResponse, BaseResponse, DataResponse } from '../resources';

class AuthService {

    signIn(payload: SignInRequest) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post("/api/Auth/signin", payload);
    }

    signUp(payload: SignUpRequest) : Promise<BaseResponse> {
        return axiosConfig.post("/api/Auth/signup", payload)
    }

    googleAuthorize(payload: GoogleAuthorizeType) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post("/api/Auth/google/authorize", payload);
    }

}

const authService = new AuthService();
export default authService;