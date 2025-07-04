const axios = require('axios')

// External API configuration
const API_BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret'
const API_KEY = 'Bearer aSuperSecretKey'

/**
 * Service for processing files from external API
 */
const filesService = {
  /**
   * Get list of files from external API
   * @returns {Promise<Array>} - Array of file names
   */
  async getFilesList () {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`, {
        headers: {
          authorization: API_KEY
        }
      })
      return response.data.files || []
    } catch (error) {
      console.error('Error fetching files list:', error.message)
      return []
    }
  },

  /**
   * Download file content from external API
   * @param {string} fileName - Name of the file to download
   * @returns {Promise<string|null>} - File content or null if error
   */
  async downloadFile (fileName) {
    try {
      const response = await axios.get(`${API_BASE_URL}/file/${fileName}`, {
        headers: {
          authorization: API_KEY
        }
      })
      return response.data
    } catch (error) {
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`Error downloading file ${fileName}: Status ${error.response.status}`)
        if (error.response.status === 404) {
          console.error(`File ${fileName} not found on the external API`)
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`Error downloading file ${fileName}: No response received`)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(`Error downloading file ${fileName}:`, error.message)
      }
      return null
    }
  },

  /**
   * Parse CSV content into structured data
   * @param {string} csvContent - CSV content as string
   * @param {string} fileName - Name of the file
   * @returns {Array} - Array of parsed line objects
   */
  parseCSVContent (csvContent, fileName) {
    if (!csvContent) return []

    // Split by newline and filter out empty lines
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    // Skip header line (first line)
    if (lines.length <= 1) return []

    const validLines = []
    
    // Process each line starting from index 1 (skipping header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const columns = line.split(',')
      
      // Validate that the line has all required columns and file name matches
      if (columns.length === 4 && columns[0] === fileName) {
        const [file, text, numberStr, hex] = columns
        
        // Validate number and hex format
        const number = parseInt(numberStr, 10)
        if (isNaN(number) || hex.length !== 32) continue
        
        validLines.push({
          text,
          number,
          hex
        })
      }
    }
    
    return validLines
  },

  /**
   * Process all files and format data according to requirements
   * @returns {Promise<Array>} - Formatted data from all files
   */
  async processFiles () {
    const filesList = await this.getFilesList()
    const result = []

    for (const fileName of filesList) {
      const fileContent = await this.downloadFile(fileName)
      if (!fileContent) continue

      const parsedLines = this.parseCSVContent(fileContent, fileName)
      
      // Only add files that have valid lines
      if (parsedLines.length > 0) {
        result.push({
          file: fileName,
          lines: parsedLines
        })
      }
    }

    return result
  }
}

module.exports = filesService
