const filesService = require('../services/files.service')

/**
 * Controller for handling file data requests
 */
const filesController = {
  /**
   * Get list of available files
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getFilesList: async (req, res, next) => {
    try {
      const filesList = await filesService.getFilesList()
      res.json({ files: filesList })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Get processed data from files
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getFilesData: async (req, res, next) => {
    try {
      const { fileName } = req.query
      let filesData

      if (fileName) {
        // Process only the specified file
        const fileContent = await filesService.downloadFile(fileName)
        if (!fileContent) {
          return res.status(404).json({ error: `File ${fileName} not found or could not be processed` })
        }

        const parsedLines = filesService.parseCSVContent(fileContent, fileName)
        if (parsedLines.length > 0) {
          filesData = [{
            file: fileName,
            lines: parsedLines
          }]
        } else {
          filesData = []
        }
      } else {
        // Process all files
        filesData = await filesService.processFiles()
      }

      res.json(filesData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = filesController
