const Devices = require('../../models/devices')
// const Qsys = require('../../models/bak/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async (io) => {
  const devices = await Devices.find()
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].devicetype === 'Q-Sys') {
      await qsys.getPA(devices[i])
    } else if (devices[i].devicetype === 'Barix') {
      await barix.getBarix(devices[i])
    }
  }
  setTimeout(async () => {
    io.emit('devices', await Devices.find())
  }, 1000)
}

module.exports.getMasters = async (io) => {
  const masters = await Devices.find({ mode: 'Master' })
  for (let i = 0; i < masters.length; i++) {
    if (masters[i].devicetype === 'Q-Sys') {
      await qsys.getPA(masters[i])
    }
  }
  setTimeout(async () => {
    io.emit('devices', await Devices.find())
  }, 1000)
}

module.exports.setStatus = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.devicetype === 'Barix') {
      await barix.getBarix(device)
    } else if (device.devicetype === 'Q-Sys') {
      await qsys.getStatus(device)
    }
  })
}