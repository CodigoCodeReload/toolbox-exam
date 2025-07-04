import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../redux/slices/filesSlice'
import FileFilter from '../components/FileFilter'

// Mock the async thunks
jest.mock('../redux/slices/filesSlice', () => {
  const originalModule = jest.requireActual('../redux/slices/filesSlice')
  return {
    __esModule: true,
    ...originalModule,
    fetchFilesList: jest.fn(() => ({ type: 'files/fetchFilesList/fulfilled', payload: ['test1.csv', 'test2.csv'] })),
    fetchFilesData: jest.fn(() => ({ type: 'files/fetchFilesData/fulfilled', payload: [] })),
    setSelectedFile: jest.fn((fileName) => ({ type: 'files/setSelectedFile', payload: fileName }))
  }
})

describe('FileFilter Component', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        files: filesReducer
      },
      preloadedState: {
        files: {
          filesList: ['test1.csv', 'test2.csv'],
          filesData: [],
          selectedFile: null,
          status: 'succeeded',
          error: null
        }
      }
    })
  })

  test('renders file filter dropdown', () => {
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    )

    expect(screen.getByText('Filter by File Name')).toBeInTheDocument()
    expect(screen.getByText('All Files')).toBeInTheDocument()
  })

  test('dropdown shows file list when clicked', async () => {
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    )

    // Click the dropdown toggle
    fireEvent.click(screen.getByText('All Files'))

    // Check that file names appear in the dropdown
    expect(screen.getByText('test1.csv')).toBeInTheDocument()
    expect(screen.getByText('test2.csv')).toBeInTheDocument()
  })
})
