const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})

router.use('/auth', require('./auth'))
router.use('/eventlog', require('./eventlog'))
router.use('/sensors', require('./barix'))
router.use('/locations', require('./locations'))
router.use('/zones', require('./zones'))

module.exports = router
