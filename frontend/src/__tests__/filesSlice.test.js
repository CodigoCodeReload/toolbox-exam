import { configureStore } from '@reduxjs/toolkit'
import filesReducer, { 
  setSelectedFile, 
  clearSelectedFile 
} from '../redux/slices/filesSlice'

describe('filesSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        files: filesReducer
      }
    })
  })

  test('should handle initial state', () => {
    const state = store.getState().files
    expect(state).toEqual({
      filesList: [],
      filesData: [],
      selectedFile: null,
      status: 'idle',
      error: null
    })
  })

  test('should handle setSelectedFile', () => {
    store.dispatch(setSelectedFile('test1.csv'))
    const state = store.getState().files
    expect(state.selectedFile).toEqual('test1.csv')
  })

  test('should handle clearSelectedFile', () => {
    // First set a selected file
    store.dispatch(setSelectedFile('test1.csv'))
    // Then clear it
    store.dispatch(clearSelectedFile())
    const state = store.getState().files
    expect(state.selectedFile).toBeNull()
  })
})
