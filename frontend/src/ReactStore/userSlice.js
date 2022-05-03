import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'User Object',
    initialState : {
        userObject : {}
    },
    reducers : {
        updateUser : (state, action) => {
            state.userObject = action.payload
        }
    }
})

export const {updateUser} = userSlice.actions
export default userSlice.reducer