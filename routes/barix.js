const express = require('express')
const router = express.Router()
const Barix = require('../models/barix')


router.get('/data/submit', async function (req, res) {
  const { mac, alarm, info } = req.query
  // make barix data to object
  const objBarixData = new Object
  info.split(',').forEach((item) => {
    let r = item.split('=')
    objBarixData[r[0]] = r[1]
  })
  // console.log(objBarixData)

  //find db
  const r = await Barix.findOne({ mac: mac })
  if (r) {
    await Barix.updateOne({ _id: r._id },
      { $set: {
        mac,
        alarm,
        status: true,
        updatedAt: Date.now(),
        info: objBarixData
      }
    })
  } else {
    const newDevice = new Barix({
      mac,
      alarm,
      status: true,
      checked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      info: objBarixData
    })
    r = await newDevice.save()
    console.log('새로운 장비가 등록되었습니다.')
  }
  // const r = await Barix.findOneAndUpdate({ mac: mac }, { $set: { mac, alarm, info: objBarixData } }, { upsert: true })
  // if (r) {
  //   console.log(r)
  // }

  //   if (result.length > 0) {
  //     dbBarix.update({
  //       alarm,
  //       buffer: obj.BufferLevel,
  //       latency: obj.Latency,
  //       frameloss: obj.FrameLoss,
  //       framedup: obj.FrameDup,
  //       framedrop: obj.FrameDrop,
  //       softerrorcount: obj.SoftErrorCount,
  //       streamnumber: obj.StreamNumber,
  //       bitrate: obj.Bitrate,
  //       reconnects: obj.Reconnects,
  //       error: obj.Error,
  //       volume: obj.Volume,
  //       uptime: obj.UpTime,
  //       ipaddress: obj.IP_address,
  //       streamurl: obj.URL
  //     }, { where: { mac } }).then((r) => {
  //       console.log('update! ', r)
  //     })
  //   } else {
  //     dbBarix.create({
  //       mac,
  //       alarm,
  //       buffer: obj.BufferLevel,
  //       latency: obj.Latency,
  //       frameloss: obj.FrameLoss,
  //       framedup: obj.FrameDup,
  //       framedrop: obj.FrameDrop,
  //       softerrorcount: obj.SoftErrorCount,
  //       streamnumber: obj.StreamNumber,
  //       bitrate: obj.Bitrate,
  //       reconnects: obj.Reconnects,
  //       error: obj.Error,
  //       volume: obj.Volume,
  //       uptime: obj.UpTime,
  //       ipaddress: obj.IP_address ?? '0.0.0.0',
  //       streamurl: obj.URL
  //     }).then((r) => {
  //       console.log('새로운 장비가 등록되었습니다.', r.mac, r.info.IP_address)
  //     })
  //   }
  // })
  res.sendStatus(200)
})
module.exports = router