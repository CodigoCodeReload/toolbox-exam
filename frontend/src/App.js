import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchFilesData } from './redux/slices/filesSlice';
import FileFilter from './components/FileFilter';
import FilesDataDisplay from './components/FilesDataDisplay';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load all files data initially
    dispatch(fetchFilesData());
  }, [dispatch]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="mb-4">Files Data</h1>
          <FileFilter />
          <FilesDataDisplay />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
