const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})

router.use('/auth', require('./auth'))
router.use('/eventlog', require('./eventlog'))
// router.use('/sensors', require('./devices/barix'))
router.use('/devices', require('./devices'))
router.use('/locations', require('./locations'))

module.exports = router
