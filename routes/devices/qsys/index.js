/** @format */

const express = require('express')
const router = express.Router()

const Devices = require('models/devices')
const qsys = require('api/devices/qsys')

router.post('/changeVol', async (req, res) => {
  try {
    qsys.changeVol(req.body)
    res.status(200).json(req.body)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: err,
      message: '알 수 없는 오류가 발생하였습니다.'
    })
  }
})

router.post('/changeMute', async (req, res) => {
  try {
    qsys.changeMute(req.body)
    res.status(200).json(req.body)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: err,
      message: '알 수 없는 오류가 발생하였습니다.'
    })
  }
})


module.exports = router
