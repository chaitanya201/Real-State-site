import { createSlice } from "@reduxjs/toolkit";

export const loginStatusSlice = createSlice({
    name:'user login status',
    initialState: {
        isLoggedIn : false
    },
    reducers: {
        updateLoginStatus : (state) => {
            state.isLoggedIn = true
        }
    }
})
export const {updateLoginStatus} = loginStatusSlice.actions
export default loginStatusSlice.reducer