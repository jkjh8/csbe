
const express = require('express')
const router = express.Router()

const Devices = require('../../../models/devices')
const Barixes = require('../../../models/barixes')
const Qsys = require('../../../models/qsys')
const { check } = require('./functions')
const { createQsys, editQsys } =require('../../../api/devices/qsys')

router.use('/qsys', require('./qsys'))
router.use('/barix', require('./barix'))

router.get('/', async function (req, res) {
  try {
    const r = await Devices.find()
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

async function deleteDevices (obj) {
  try {
    await Qsys.deleteMany({ ipaddress: obj.ipaddress })
    await Barixes.deleteMany({ ipaddress: obj.ipaddress})
    return null
  } catch (err) {
    return err
  }
}

router.post('/', async function (req, res) {
  const info = req.body
  try {
    // 중복확인
    const checkMessage = await check(info)
    if (checkMessage) return res.status(500).json({ message: checkMessage })
    // qsys 생성
    if (info.type === 'QSys') { createQsys(info) }
    // barix 생성 안함 데이터 갱신시 자동 등록
    // 디바이스 생성 및 저장
    const device = new Devices(info)
    device.save().then(async (doc) => {
      return res.status(200).json({ data: doc })
    }).catch( async (err) => {
      await deleteDevices(info)
      return res.status(500).json({ message: '데이터 베이스 오류가 발생하였습니다.', data: err })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ data: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async function (req, res) {
  const info = req.body
  try {
    // 중복확인
    const checkMessage = await check(info)
    if (checkMessage) return res.status(500).json({ message: checkMessage })

    // qsys 확인
    if (info.type === 'QSys') { editQsys(info) }
    info.ckecked = true
    const r = await Devices.updateOne({ _id: info._id }, { $set: info })
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err, message: ' 알 수 없는 오류가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  try {
    let r = await Devices.deleteOne({ ipaddress: req.query.ipaddress })
    await deleteDevices(req.query)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
