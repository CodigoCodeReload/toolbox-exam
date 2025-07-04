const { expect } = require('chai');
const sinon = require('sinon');
const filesController = require('../../controllers/files.controller');
const filesService = require('../../services/files.service');

describe('Files Controller', () => {
  describe('getFilesData', () => {
    let req, res, next;

    beforeEach(() => {
      // Mock Express request, response, and next function
      req = {};
      res = {
        json: sinon.spy()
      };
      next = sinon.spy();
    });

    it('should return processed files data when service is successful', async () => {
      // Mock data to be returned by the service
      const mockData = [
        {
          file: 'file1.csv',
          lines: [
            {
              text: 'RgTya',
              number: 64075909,
              hex: '70ad29aacf0b690b0467fe2b2767f765'
            }
          ]
        }
      ];

      // Stub the service method
      sinon.stub(filesService, 'processFiles').resolves(mockData);

      // Call the controller method
      await filesController.getFilesData(req, res, next);

      // Verify the response
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(mockData);
      expect(next.notCalled).to.be.true;

      // Restore the stub
      filesService.processFiles.restore();
    });

    it('should call next with error when service fails', async () => {
      // Create an error to be thrown by the service
      const error = new Error('Service error');

      // Stub the service method to throw an error
      sinon.stub(filesService, 'processFiles').rejects(error);

      // Call the controller method
      await filesController.getFilesData(req, res, next);

      // Verify error handling
      expect(res.json.notCalled).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.equal(error);

      // Restore the stub
      filesService.processFiles.restore();
    });
  });
});
