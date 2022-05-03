import { createSlice } from "@reduxjs/toolkit";

const loginTokenSlice = createSlice({
    name: 'Login Token',
    initialState : {
        token : null
    },
    reducers : {
        updateToken : (state, action) => {
            state.token = action.payload
        }
    }
})

export const {updateToken} = loginTokenSlice.actions
export default loginTokenSlice.reducer