const { expect } = require('chai');
const nock = require('nock');
const app = require('../../index');
const axios = require('axios');
const sinon = require('sinon');

describe('API Integration Tests', () => {
  let server;
  const PORT = 3001;
  const BASE_URL = `http://localhost:${PORT}`;
  
  before(() => {
    // Start the server on a different port for testing
    server = app.listen(PORT);
  });
  
  after(() => {
    // Close the server after tests
    server.close();
  });
  
  beforeEach(() => {
    // Mock external API calls
    nock.cleanAll();
  });
  
  describe('GET /files/data', () => {
    it('should return formatted data from files', async () => {
      // Mock the external API responses
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, {
          files: ['file1.csv', 'file2.csv']
        });
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, 'file,text,number,hex\nfile2.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5');
      
      // Make request to our API
      const response = await axios.get(`${BASE_URL}/files/data`);
      
      // Verify response
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data).to.have.lengthOf(2);
      
      // Verify first file data
      expect(response.data[0].file).to.equal('file1.csv');
      expect(response.data[0].lines).to.be.an('array');
      expect(response.data[0].lines[0]).to.deep.equal({
        text: 'RgTya',
        number: 64075909,
        hex: '70ad29aacf0b690b0467fe2b2767f765'
      });
      
      // Verify second file data
      expect(response.data[1].file).to.equal('file2.csv');
      expect(response.data[1].lines).to.be.an('array');
      expect(response.data[1].lines[0]).to.deep.equal({
        text: 'AtjW',
        number: 6,
        hex: 'd33a8ca5d36d3106219f66f939774cf5'
      });
    });
    
    it('should handle empty files and errors correctly', async () => {
      // Mock the external API responses
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, {
          files: ['file1.csv', 'empty.csv', 'error.csv']
        });
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/empty.csv')
        .reply(200, 'file,text,number,hex');
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/error.csv')
        .reply(500, 'Internal Server Error');
      
      // Make request to our API
      const response = await axios.get(`${BASE_URL}/files/data`);
      
      // Verify response
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      
      // Should only include file1.csv with valid data
      expect(response.data).to.have.lengthOf(1);
      expect(response.data[0].file).to.equal('file1.csv');
    });
    
    it('should handle malformed CSV data correctly', async () => {
      // Mock the external API responses
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, {
          files: ['malformed.csv']
        });
      
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/malformed.csv')
        .reply(200, 'file,text,number,hex\nmalformed.csv,text,not-a-number,short-hex\nmalformed.csv,valid,123,70ad29aacf0b690b0467fe2b2767f765');
      
      // Make request to our API
      const response = await axios.get(`${BASE_URL}/files/data`);
      
      // Verify response
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      
      // Should include malformed.csv with only the valid line
      expect(response.data).to.have.lengthOf(1);
      expect(response.data[0].file).to.equal('malformed.csv');
      expect(response.data[0].lines).to.have.lengthOf(1);
      expect(response.data[0].lines[0].text).to.equal('valid');
    });
  });
});
