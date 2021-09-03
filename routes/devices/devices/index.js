
const express = require('express')
const router = express.Router()
const Devices = require('../../../models/devices')
const Barixes = require('../../../models/barixes')
const Qsys = require('../../../models/qsys')
const qsys = require('../../../api/devices/qsys')

const { check, createQsys, compaireQsys } = require('./functions')

router.get('/', async function (req, res) {
  try {
    const r = await Devices.find()
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

async function createqQsys (obj) {
  const newQsys = new Qsys({
    ipaddress: obj.ipaddress,
  })
  qsys.addPA(newQsys, obj.channels)
  qsys.addStations(newQsys, obj.stations)
  qsys.addTx(newQsys, obj.tx)
  qsys.addRx(newQsys, obj.rx)
  await newQsys.save()
}

router.post('/', async function (req, res) {
  const info = req.body
  try {
    // 중복확인
    const checkMessage = await check(info)
    if (checkMessage) return res.status(500).json({ message: checkMessage })
    // qsys 생성
    if (info.type === 'QSys') {
      const qsysError = await createQsys(info)
      if (qsysError) return res.status(500).json({ message: qsysError })
    }
    // barix 생성 안함 데이터 갱신시 자동 등록

    // 디바이스 생성 및 저장
    const device = new Devices(info)
    device.save().then(doc => {
      return res.status(200).json({ data: doc })
    }).catch( async (err) => {
      await Qsys.deleteMany({ ipaddress: info.ipaddress })
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
    if (info.type === 'QSys') {
      console.log('비교시작')
      const qsysError = await compaireQsys(info)
      if (qsysError) return res.status(500).json({ message: qsysError })
    }
    qsys.getZones(info)
    qsys.getStations(info)

    // if (client) {
    //   const data = await qsys.updateZones(info, client, info.channels)
    //   client.end()
    //   console.log(data)
    // } else {
    //   console.log(`Q-SYS IP: ${info.ipaddress}에 접속할 수 없습니다.`)
    // }

    info.ckecked = true
    delete info.updatedAt

    r = await Devices.updateOne({
      _id: info._id
    }, {
      $set: info
    })
    // qsys에서 채널수 맞춰서 db 값을 줄이거나 늘이는 로직 해야됨
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err, message: ' 알 수 없는 오류가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  try {
    let r = await Devices.deleteOne({ ipaddress: req.query.ipaddress })
    await Barixes.deleteOne({ ipaddress: req.query.ipaddress })
    await Qsys.deleteOne({ ipaddress: req.query.ipaddress })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
