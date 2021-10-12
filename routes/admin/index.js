const express = require('express')
const router = express.Router()

const files = require('../../api/files')

router.get('/removeTmp', files.removeTmpFiles)


module.exports = router