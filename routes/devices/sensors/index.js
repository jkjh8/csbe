const express = require('express')
const router = express.Router()
const Devices = require('../../../models/devices')
const qsys = require('../../../api/devices/qsys')
const barix = require('../../../api/devices/barix')

router.post('/qsys', async (req, res) => {
  const ipaddress = req.body[0].Address
  let mac = req.body[0].MACAddress.replace(/:/gi, '')

  const chkDevice = await Devices.findOne({ ipaddress: ipaddress })
  if (!chkDevice) {
    const info = await qsys.getStatus({ host: ipaddress, port: 1710 })
    const newDevice = new Devices({
      ipaddress, mac,
      type: 'QSys',
      mode: 'Input',
      port: 1710,
      info: info,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    await newDevice.save()
  }
  res.sendStatus(200)
})

router.get('/data/submit', async (req, res) => {
  const { mac, alarm, info } = req.query
  // make barix data to object
  const objBarixData = new Object
  info.split(',').forEach((item) => {
    let r = item.split('=')
    objBarixData[r[0]] = r[1]
  })
  //find db
  const chkDevice = await Devices.findOne({ mac: mac })
  if (chkDevice) {
    await Devices.updateOne({ mac: r.mac },
      { $set: {
        alarm,
        ipaddress: objBarixData.IP_address,
        type: 'Barix',
        status: true,
        updatedAt: Date.now(),
      }
    })
  } else {
    const info = await barix(objBarixData.IP_address)
    const newDevice = new Devices({
      mac,
      alarm,
      ipaddress: objBarixData.IP_address,
      type: 'Barix',
      status: true,
      mode: 'Output',
      info: info,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    await newDevice.save()
    console.log('새로운 장비가 등록되었습니다.')
  }
  res.sendStatus(200)
})

module.exports = router