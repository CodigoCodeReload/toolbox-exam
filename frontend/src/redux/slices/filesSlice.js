import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Use environment variable or fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

// Async thunk for fetching file list
export const fetchFilesList = createAsyncThunk(
  'files/fetchFilesList',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/files/list`)
    return response.data.files
  }
)

// Async thunk for fetching file data with optional fileName filter
export const fetchFilesData = createAsyncThunk(
  'files/fetchFilesData',
  async (fileName = null) => {
    const url = fileName
      ? `${API_BASE_URL}/files/data?fileName=${fileName}`
      : `${API_BASE_URL}/files/data`
    const response = await axios.get(url)
    return response.data
  }
)

const initialState = {
  filesList: [],
  filesData: [],
  selectedFile: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchFilesList
      .addCase(fetchFilesList.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFilesList.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.filesList = action.payload
      })
      .addCase(fetchFilesList.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Handle fetchFilesData
      .addCase(fetchFilesData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.filesData = action.payload
      })
      .addCase(fetchFilesData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { setSelectedFile, clearSelectedFile } = filesSlice.actions

export default filesSlice.reducer
