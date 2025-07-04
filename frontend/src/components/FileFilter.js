import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Dropdown } from 'react-bootstrap'
import { fetchFilesList, setSelectedFile, fetchFilesData } from '../redux/slices/filesSlice'

const FileFilter = () => {
  const dispatch = useDispatch()
  const { filesList, selectedFile } = useSelector(state => state.files)

  useEffect(() => {
    dispatch(fetchFilesList())
  }, [dispatch])

  const handleFileSelect = (fileName) => {
    dispatch(setSelectedFile(fileName))
    dispatch(fetchFilesData(fileName))
  }

  const handleShowAll = () => {
    dispatch(setSelectedFile(null))
    dispatch(fetchFilesData())
  }

  return (
    <div className="mb-4">
      <Form.Group>
        <Form.Label>Filter by File Name</Form.Label>
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="primary" id="dropdown-file-filter">
            {selectedFile || 'All Files'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShowAll}>All Files</Dropdown.Item>
            <Dropdown.Divider />
            {filesList.map(fileName => (
              <Dropdown.Item 
                key={fileName} 
                onClick={() => handleFileSelect(fileName)}
                active={selectedFile === fileName}
              >
                {fileName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
    </div>
  )
}

export default FileFilter
