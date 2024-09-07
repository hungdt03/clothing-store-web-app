import axios, { AxiosError } from "axios";
import { getAccessToken } from "../utils/auth";

const instance = axios.create({
    baseURL: 'http://localhost:5151'
});

declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean
    }
}


instance.interceptors.request.use(function (config) {

    let token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error: AxiosError) {
    // const originalRequest = error.config

    // if (!originalRequest) {
    //     return Promise.reject(error)
    // }

    // if(error.response?.status === 401 || error.response?.status === 403 && !originalRequest?._retry) {
    //     originalRequest._retry = true
    //     // getUserDetails(localStorage.getItem('userToken')!)
    // }

    return error.response?.data;
});




export default instance


