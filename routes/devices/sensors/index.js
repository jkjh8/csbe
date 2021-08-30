const express = require('express')
const router = express.Router()
const Devices = require('../../../models/devices')
const qsys = require('../../../api/devices/qsys')
const barix = require('../../../api/devices/barix')

router.post('/qsys', async (req, res) => {
  const nic = req.body[0]
  console.log(nic)
  const ipaddress = nic.Address
  let mac = nic.MACAddress.replace(/:/gi, '')

  const qsysRt = await Devices.findOne({ ipaddress: ipaddress })
  if (!qsysRt) {
    const info = await qsys.getStatus({ host: ipaddress, port: 1710 })
    const qsysCreate = new Devices({
      ipaddress, mac,
      type: 'QSys',
      mode: 'Input',
      status: true,
      port: 1710,
      info: info,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    await qsysCreate.save()
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
  const r = await Devices.findOne({ mac: mac })
  if (r) {
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
      status: true,
      checked: false,
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