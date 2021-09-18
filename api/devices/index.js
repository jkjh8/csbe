const Devices = require('../../models/devices')
const Qsys = require('../../models/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      await barix.getBarix(device)
    } else if (device.type === 'QSys') {
      console.log(device.ipaddress)
      qsys.createQsys(device)
    //   try {
    //     // qsys.paStatusUpdate(device.ipaddress)
    //     // qsys.getZones(device)
    //     const r = await Qsys.findOne({ ipaddress: device.ipaddress })
    //     r.zone.forEach(e => {
    //       if (e.Name.match(/zone.\d+.gain/)) {
    //         console.log(e)
    //       }
    //     })
    //   } catch (error) {
    //     returnError(device.ipaddress)
    //   }
    }
  })
}

async function returnError (ipaddress) {
  return await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
}
