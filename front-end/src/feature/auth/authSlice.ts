import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
import { AuthResponse, UserResource } from '../../resources';

export type AuthState = {
    accessToken?: string;
    user?: UserResource;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

export type InititalState = {
    isAuthenticated: boolean;
    user?: UserResource
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: undefined,
        isAuthenticated: false,
        isInitialized: false,
        user: undefined
    } as AuthState,
    reducers: {
        signIn: (state, action: PayloadAction<AuthResponse>) => {
            localStorage.setItem('accessToken', action.payload.accessToken!)
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true;
        },
        signOut: (state) => {
            localStorage.removeItem('accessToken')
            state.user = undefined
            state.accessToken = undefined
        },
        setUserDetails: (state, action: PayloadAction<UserResource>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        initialize: (state, action: PayloadAction<InititalState>) => {
            state.user = action.payload.user
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isInitialized = true;
        },
    },
})

export const selectAuth = (state : RootState) => state.auth;
export const { signIn, signOut, setUserDetails, initialize } = authSlice.actions
export default authSlice.reducer