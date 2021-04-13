const express = require('express')
const db = require('../helpers/queries')
// Add to the bottom
const router = express.Router()
router.get('/messages', db.getMessages)
router.post('/messages', db.createMessage)

module.exports = router
