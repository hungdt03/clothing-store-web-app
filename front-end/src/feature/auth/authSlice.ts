import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';
import { AuthResponse, UserResource } from '../../resources';
import { getIntitialAuthState } from '../../utils/auth';

const authSlice = createSlice({
    name: 'auth',
    initialState: getIntitialAuthState(),
    reducers: {
        signIn: (state, action: PayloadAction<AuthResponse>) => {
            localStorage.setItem('accessToken', action.payload.accessToken!)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
        },
        signOut: (state) => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
            state.user = undefined
            state.accessToken = undefined
        },
        setUserDetails: (state, action: PayloadAction<UserResource>) => {
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user = action.payload
        }
    },
})

export const selectAuth = (state : RootState) => state.auth;
export const { signIn, signOut, setUserDetails } = authSlice.actions
export default authSlice.reducer