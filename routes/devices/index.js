/** @format */

const express = require('express')
const router = express.Router()

const Devices = require('models/devices')
const { check } = require('./functions')
const qsys = require('api/devices/qsys')
const { getBarix } = require('api/devices/barix')

router.use('/qsys', require('./qsys'))

router.get('/', async function (req, res) {
  try {
    const r = await Devices.find().sort({ _id: 1, channel: 1 })
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.get('/info', async function (req, res) {
  try {
    const { id } = req.query
    const r = await Devices.findById(id)
    res.status(200).json(r)
  } catch (error) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.post('/', async function (req, res) {
  const info = req.body
  try {
    // 중복확인
    const checkMessage = await check(info)
    if (checkMessage) return res.status(500).json({ message: checkMessage })
    // qsys 생성
    // barix 생성 안함 데이터 갱신시 자동 등록
    // 디바이스 생성 및 저장
    const device = new Devices(info)
    const r = await device.save()
    res.status(200).json({ doc: r })
    if (r.type === 'Q-Sys') {
      await qsys.getStatus(r)
    }
    if (r.type === 'Barix') {
      await getBarix(r)
    }
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ data: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async function (req, res) {
  const info = req.body
  try {
    // 중복확인
    const checkMessage = await check(info)
    if (checkMessage) return res.status(500).json({ message: checkMessage })
    const r = await Devices.updateOne({ _id: info._id }, { $set: info })
    res.status(200).json({ data: r })
    // if (info.devicetype === 'QSys') {
    //   await createQsys(info)
    // }
    // if (info.devicetype === 'Barix') {
    //   await getBarix(info)
    // }
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: err,
        message: ' 알 수 없는 오류가 발생하였습니다.'
      })
  }
})

router.get('/delete', async (req, res) => {
  try {
    let r = await Devices.deleteOne({ ipaddress: req.query.ipaddress })
    res.status(200).json({ result: r })
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.get('/checked', async (req, res) => {
  try {
    const info = req.query
    const r = await Devices.updateOne(
      { _id: info._id },
      { $set: { checked: true } }
    )
    res.status(200).json({ result: r })
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

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

router.get('/cancel', async(req, res) => {
  try {
    await qsys.cancel({ ipaddress: req.query.ipaddress })
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error:err,
      message: '알 수 없는 오류가 발생하였습니다.'
    })
  }
})

module.exports = router
