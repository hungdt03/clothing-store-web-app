import { AuthResponse, UserResource } from "../resources"


export function getAuthInfo() {
    const authString = localStorage.getItem('user')
    const auth = (authString ? JSON.parse(authString) : {}) as UserResource
    return auth
}

export function getAccessToken() {
    const authString = localStorage.getItem('accessToken')
    return authString ?? ""
}

export function getIntitialAuthState() {
    return {
        accessToken: getAccessToken(),
        user: getAuthInfo()
    } as AuthResponse
}