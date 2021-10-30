const Devices = require('../../models/devices')
// const Qsys = require('../../models/bak/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.devicetype === 'Barix') {
      const r = await barix.getBarix(device)
      console.log(r)
    } else if (device.devicetype === 'Q-Sys') {
      console.log(device.ipaddress)
      qsys.updateDevice(device)
    }
  })
}
