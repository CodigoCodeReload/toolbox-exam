import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../redux/slices/filesSlice'
import FilesDataDisplay from '../components/FilesDataDisplay'

describe('FilesDataDisplay Component', () => {
  const renderWithState = (initialState) => {
    const store = configureStore({
      reducer: {
        files: filesReducer
      },
      preloadedState: {
        files: initialState
      }
    })

    return render(
      <Provider store={store}>
        <FilesDataDisplay />
      </Provider>
    )
  }

  test('shows loading spinner when status is loading', () => {
    renderWithState({
      filesList: [],
      filesData: [],
      selectedFile: null,
      status: 'loading',
      error: null
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows error message when status is failed', () => {
    renderWithState({
      filesList: [],
      filesData: [],
      selectedFile: null,
      status: 'failed',
      error: 'Test error message'
    })

    expect(screen.getByText(/Error loading data/)).toBeInTheDocument()
    expect(screen.getByText(/Test error message/)).toBeInTheDocument()
  })

  test('shows info message when no data is available', () => {
    renderWithState({
      filesList: [],
      filesData: [],
      selectedFile: null,
      status: 'succeeded',
      error: null
    })

    expect(screen.getByText(/No data available/)).toBeInTheDocument()
  })

  test('shows file-specific message when no data for selected file', () => {
    renderWithState({
      filesList: ['test1.csv'],
      filesData: [],
      selectedFile: 'test1.csv',
      status: 'succeeded',
      error: null
    })

    expect(screen.getByText(/No valid data found for file: test1.csv/)).toBeInTheDocument()
  })

  test('renders file data when available', () => {
    const mockData = [
      {
        file: 'test1.csv',
        lines: [
          { text: 'Sample Text', number: 123, hex: '0123456789abcdef0123456789abcdef' }
        ]
      }
    ]

    renderWithState({
      filesList: ['test1.csv'],
      filesData: mockData,
      selectedFile: null,
      status: 'succeeded',
      error: null
    })

    expect(screen.getByText('test1.csv')).toBeInTheDocument()
    expect(screen.getByText('Sample Text')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('0123456789abcdef0123456789abcdef')).toBeInTheDocument()
  })
})
