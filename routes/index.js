const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})

router.use('/auth', require('./auth'))
router.use('/files', require('./files'))
router.use('/broadcast', require('./broadcast'))
router.use('/eventlog', require('./eventlog'))
// router.use('/sensors', require('./devices/barix'))
router.use('/devices', require('./devices'))
router.use('/hardware', require('./hardware'))
router.use('/admin', require('./admin'))

module.exports = router
