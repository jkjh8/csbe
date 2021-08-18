const express = require('express')
const router = express.Router()
const dbBarix = require('../models').Barix


router.get('/data/submit', function (req, res) {
  const { mac, alarm, info } = req.query
  const obj = new Object
  info.split(',').forEach((item) => {
    let r = item.split('=')
    obj[r[0]] = r[1]
  })
  console.log(obj)
  dbBarix.findAll({
    where: {
      mac: mac
    }
  }).then((result) => {
    if (result.length > 0) {
      dbBarix.update({
        alarm,
        buffer: obj.BufferLevel,
        latency: obj.Latency,
        frameloss: obj.FrameLoss,
        framedup: obj.FrameDup,
        framedrop: obj.FrameDrop,
        softerrorcount: obj.SoftErrorCount,
        streamnumber: obj.StreamNumber,
        bitrate: obj.Bitrate,
        reconnects: obj.Reconnects,
        error: obj.Error,
        volume: obj.Volume,
        uptime: obj.UpTime,
        ipaddress: obj.IP_address,
        streamurl: obj.URL
      }, { where: { mac } }).then((r) => {
        console.log('update! ', r)
      })
    } else {
      dbBarix.create({
        mac,
        alarm,
        buffer: obj.BufferLevel,
        latency: obj.Latency,
        frameloss: obj.FrameLoss,
        framedup: obj.FrameDup,
        framedrop: obj.FrameDrop,
        softerrorcount: obj.SoftErrorCount,
        streamnumber: obj.StreamNumber,
        bitrate: obj.Bitrate,
        reconnects: obj.Reconnects,
        error: obj.Error,
        volume: obj.Volume,
        uptime: obj.UpTime,
        ipaddress: obj.IP_address ?? '0.0.0.0',
        streamurl: obj.URL
      }).then((r) => {
        console.log('새로운 장비가 등록되었습니다.', r.mac, r.info.IP_address)
      })
    }
  })
  res.sendStatus(200)
})

router.get('/get', async function (req, res) {
  try {
    const r = await dbBarix.findAndCountAll()
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

module.exports = router