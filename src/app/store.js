import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import uploadReducer from '../features/upload/uploadSlice'
import searchReducer from '../features/search/searchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    search: searchReducer,
  },
})
