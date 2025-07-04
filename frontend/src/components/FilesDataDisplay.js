import React from 'react'
import { useSelector } from 'react-redux'
import { Card, Table, Alert, Spinner } from 'react-bootstrap'

const FilesDataDisplay = () => {
  const { filesData, status, error, selectedFile } = useSelector(state => state.files)

  if (status === 'loading') {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <Alert variant="danger">
        Error loading data: {error}
      </Alert>
    )
  }

  if (filesData.length === 0) {
    return (
      <Alert variant="info">
        {selectedFile 
          ? `No valid data found for file: ${selectedFile}` 
          : 'No data available. Files might be empty or contain invalid data.'}
      </Alert>
    )
  }

  return (
    <div>
      {filesData.map((fileData) => (
        <Card key={fileData.file} className="mb-4">
          <Card.Header className="file-name">
            <strong>{fileData.file}</strong>
          </Card.Header>
          <Card.Body>
            {fileData.lines.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="table-header">Text</th>
                    <th className="table-header">Number</th>
                    <th className="table-header">Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.lines.map((line, index) => (
                    <tr key={index}>
                      <td>{line.text}</td>
                      <td>{line.number}</td>
                      <td className="hex-column">{line.hex}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="warning">No valid lines found in this file.</Alert>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default FilesDataDisplay
