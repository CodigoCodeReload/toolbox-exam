const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./swagger')
const filesRoutes = require('./routes/files')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: 'http://localhost:3002', // Frontend URL
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// Routes
app.use('/files', filesRoutes)

// Root route redirects to API documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
})

module.exports = app // Export for testing
