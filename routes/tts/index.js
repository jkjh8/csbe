/** @format */

const express = require('express')
const router = express.Router()
const tts = require('api/py')

router.post('/preview', tts.preview)
router.get('/voices', tts.getVoices)

module.exports = router
