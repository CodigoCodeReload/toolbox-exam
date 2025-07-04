const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Files Processor API',
      version: '1.0.0',
      description: 'API that processes CSV files from an external API',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Files',
        description: 'API endpoints for processing CSV files'
      }
    ],
    components: {
      schemas: {
        FileLine: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text content from the CSV'
            },
            number: {
              type: 'integer',
              description: 'Numeric value from the CSV'
            },
            hex: {
              type: 'string',
              description: 'Hexadecimal value from the CSV (32 digits)'
            }
          }
        },
        FileData: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              description: 'The name of the CSV file'
            },
            lines: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FileLine'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Path to the API docs
}

const specs = swaggerJsdoc(options)

module.exports = specs
