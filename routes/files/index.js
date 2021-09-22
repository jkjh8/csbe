const express = require('express')
const router = express.Router()

const files = require('api/files')

router.use('/getFiles', files.getFiles)

// router.use('/sensors', require('./devices/barix'))


module.exports = router