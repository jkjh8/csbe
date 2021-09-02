const Devices = require('../../models/devices')
const Qsys = require('../../models/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      await barix.get(device.ipaddress)
    } else if (device.type === 'QSys') {
      try {
        qsys.paStatusUpdate(device.ipaddress)
      } catch (error) {
        returnError(device.ipaddress)
      }
    }
  })
}

async function returnError (ipaddress) {
  return await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
}