import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../slices/filesSlice'

const store = configureStore({
  reducer: {
    files: filesReducer
  }
})

export default store
