const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const filesService = require('../../services/files.service');

describe('Files Service', () => {
  let axiosGetStub;

  beforeEach(() => {
    // Stub axios.get to avoid actual API calls during tests
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    // Restore the stub after each test
    axiosGetStub.restore();
  });

  describe('getFilesList', () => {
    it('should return an array of files when API call is successful', async () => {
      // Mock successful API response
      axiosGetStub.resolves({
        data: {
          files: ['file1.csv', 'file2.csv']
        }
      });

      const result = await filesService.getFilesList();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result).to.include('file1.csv');
      expect(result).to.include('file2.csv');
    });

    it('should return an empty array when API call fails', async () => {
      // Mock failed API response
      axiosGetStub.rejects(new Error('API error'));

      const result = await filesService.getFilesList();
      expect(result).to.be.an('array');
      expect(result).to.be.empty;
    });
  });

  describe('downloadFile', () => {
    it('should return file content when API call is successful', async () => {
      const mockContent = 'file,text,number,hex\nfile1.csv,test,123,abcdef1234567890abcdef1234567890';
      axiosGetStub.resolves({ data: mockContent });

      const result = await filesService.downloadFile('file1.csv');
      expect(result).to.equal(mockContent);
    });

    it('should return null when API call fails', async () => {
      axiosGetStub.rejects(new Error('API error'));

      const result = await filesService.downloadFile('file1.csv');
      expect(result).to.be.null;
    });
  });

  describe('parseCSVContent', () => {
    it('should parse valid CSV content correctly', () => {
      const csvContent = 'file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765';
      const fileName = 'file1.csv';

      const result = filesService.parseCSVContent(csvContent, fileName);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.equal({
        text: 'RgTya',
        number: 64075909,
        hex: '70ad29aacf0b690b0467fe2b2767f765'
      });
    });

    it('should filter out invalid lines', () => {
      const csvContent = 'file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\nfile1.csv,invalid,notanumber,short\nfile2.csv,wrong,123,70ad29aacf0b690b0467fe2b2767f765';
      const fileName = 'file1.csv';

      const result = filesService.parseCSVContent(csvContent, fileName);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0].text).to.equal('RgTya');
    });

    it('should return empty array for empty or invalid CSV content', () => {
      expect(filesService.parseCSVContent('', 'file1.csv')).to.be.an('array').that.is.empty;
      expect(filesService.parseCSVContent('file,text,number,hex', 'file1.csv')).to.be.an('array').that.is.empty;
      expect(filesService.parseCSVContent(null, 'file1.csv')).to.be.an('array').that.is.empty;
    });
  });

  describe('processFiles', () => {
    it('should process multiple files and return formatted data', async () => {
      // Mock getFilesList to return two files
      sinon.stub(filesService, 'getFilesList').resolves(['file1.csv', 'file2.csv']);
      
      // Mock downloadFile to return content for each file
      const downloadFileStub = sinon.stub(filesService, 'downloadFile');
      downloadFileStub.withArgs('file1.csv').resolves('file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');
      downloadFileStub.withArgs('file2.csv').resolves('file,text,number,hex\nfile2.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5');
      
      const result = await filesService.processFiles();
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      
      expect(result[0].file).to.equal('file1.csv');
      expect(result[0].lines).to.be.an('array');
      expect(result[0].lines[0].text).to.equal('RgTya');
      
      expect(result[1].file).to.equal('file2.csv');
      expect(result[1].lines).to.be.an('array');
      expect(result[1].lines[0].text).to.equal('AtjW');
      
      // Restore stubs
      filesService.getFilesList.restore();
      filesService.downloadFile.restore();
    });

    it('should handle files with no valid lines', async () => {
      sinon.stub(filesService, 'getFilesList').resolves(['file1.csv', 'empty.csv']);
      
      const downloadFileStub = sinon.stub(filesService, 'downloadFile');
      downloadFileStub.withArgs('file1.csv').resolves('file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');
      downloadFileStub.withArgs('empty.csv').resolves('file,text,number,hex');
      
      const result = await filesService.processFiles();
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0].file).to.equal('file1.csv');
      
      filesService.getFilesList.restore();
      filesService.downloadFile.restore();
    });

    it('should handle download errors', async () => {
      sinon.stub(filesService, 'getFilesList').resolves(['file1.csv', 'error.csv']);
      
      const downloadFileStub = sinon.stub(filesService, 'downloadFile');
      downloadFileStub.withArgs('file1.csv').resolves('file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');
      downloadFileStub.withArgs('error.csv').resolves(null);
      
      const result = await filesService.processFiles();
      
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0].file).to.equal('file1.csv');
      
      filesService.getFilesList.restore();
      filesService.downloadFile.restore();
    });
  });
});
