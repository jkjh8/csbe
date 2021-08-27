const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})

router.use('/auth', require('./auth'))
router.use('/eventlog', require('./eventlog'))
// router.use('/sensors', require('./devices/barix'))
router.use('/', require('./devices'))
router.use('/locations', require('./locations'))
router.use('/zones', require('./zones'))
router.post('/qsc', function (req, res) {
  console.log(req.body.Page)
  res.sendStatus(200)
})
router.post('/int', function(req, res) {
  console.log(req.body)
  res.sendStatus(200)
})

module.exports = router
