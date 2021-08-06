const express = require('express')
const router = express.Router()
const api = require('../api/eventlog')

router.get('/get', api.get)
module.exports = router
