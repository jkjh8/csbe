const express = require('express')
const router = express.Router()

const files = require('api/files')

router.get('/', files.getFiles)

// router.use('/sensors', require('./devices/barix'))

router.post('/upload', files.upload)
router.post('/makeFolder', files.makeFolder)
router.post('/del', files.del)


module.exports = router