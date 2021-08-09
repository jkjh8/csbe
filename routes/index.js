const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})

router.use('/auth', require('./auth'))
router.use('/eventlog', require('./eventlog'))
router.use('/sensors/data', require('./barix'))

module.exports = router
