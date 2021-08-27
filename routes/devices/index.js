const express = require('express')
const router = express.Router()

router.use('/sensors', require('./sensors'))
router.use('/devices', require('./devices'))

module.exports = router
