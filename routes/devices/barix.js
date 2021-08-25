const express = require('express')
const router = express.Router()
const Devices = require('../../models/devices')


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
  const r = await Devices.findOne({ mac: mac })
  if (r) {
    await Devices.updateOne({ _id: r._id },
      { $set: {
        mac,
        alarm,
        ipaddress: objBarixData.IP_address,
        port: 3030,
        type: 'Barix',
        status: true,
        mode: 'Output',
        updatedAt: Date.now(),
        info: objBarixData
      }
    })
  } else {
    const newDevice = new Devices({
      mac,
      alarm,
      status: true,
      checked: false,
      ipaddress: objBarixData.IP_address,
      port: 3030,
      type: 'Barix',
      status: true,
      mode: 'Output',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      info: objBarixData
    })
    r = await newDevice.save()
    console.log('새로운 장비가 등록되었습니다.')
  }
  res.sendStatus(200)
})
module.exports = router