const Devices = require('../../models/devices')
// const Qsys = require('../../models/bak/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async (io) => {
  const devices = await Devices.find()
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].devicetype === 'Q-Sys') {
      await qsys.updateDevice(devices[i])
    } else if (devices[i].devicetype === 'Barix') {
      await barix.getBarix(devices[i])
    }
  }
  io.emit('devices', await Devices.find())
}

module.exports.getMasters = async (io) => {
  const masters = await Devices.find({ mode: 'Master' })
  for (let i = 0; i < masters.length; i++) {
    if (masters[i].devicetype === 'Q-Sys') {
      await qsys.updateDevice(masters[i])
    }
  }
  io.emit('devices', await Devices.find())
}

module.exports.getSlaves = async () => {
  const slaves = await Devices.find({ mode: 'Slave' })
  slaves.forEach(async (device) => {
    if (device.devicetype === 'Barix') {
      await barix.getBarix(device)
    } else if (device.devicetype === 'Q-Sys') {
      await qsys.updateDevice(device)
    }
  })
}