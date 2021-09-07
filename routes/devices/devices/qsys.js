
const express = require('express')
const router = express.Router()
const Devices = require('../../../models/devices')
const Barixes = require('../../../models/barixes')
const Qsys = require('../../../models/qsys')
const qsys = require('../../../api/devices/qsys')

router.get('/', async function (req, res) {
  try {
    console.log(req.query)
    const r = await Qsys.findOne({ ipaddress: req.query.ipaddress })
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

module.exports = router
