const express = require('express')
const router = express.Router()

router.get('/submit', require('../api/barix').update)

module.exports = router