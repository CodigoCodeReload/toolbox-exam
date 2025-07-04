const express = require('express')
const router = express.Router()
const filesController = require('../controllers/files.controller')

/**
 * @swagger
 * /files/list:
 *   get:
 *     summary: Get list of available files
 *     description: Returns the list of available files from the external API
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of available file names
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/list', filesController.getFilesList)

/**
 * @swagger
 * /files/data:
 *   get:
 *     summary: Get processed data from CSV files
 *     description: Retrieves data from external CSV files, processes them, and returns formatted results
 *     tags: [Files]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: string
 *         description: Optional. Filter results by file name
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileData'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/data', filesController.getFilesData)

module.exports = router
