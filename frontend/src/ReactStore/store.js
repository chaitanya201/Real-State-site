import { configureStore } from '@reduxjs/toolkit'
import loginStatus from './loginStatus'
import loginToken from './loginToken'
import userSlice from './userSlice'

export  default configureStore( {

    reducer: {
        userObject: userSlice,
        loginStatus : loginStatus,
        loginToken : loginToken
    }
}
    
)