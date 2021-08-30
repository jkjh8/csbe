const Devices = require('../../models/devices')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      try {
        const r = await barix(device.ipaddress)
        if (r) {
          await Devices.updateOne({
            ipaddress: device.ipaddress
          }, {
            $set: {
              status: true,
              info: r
            }
          })
        } else {
          returnError(device.ipaddress)
        }
      } catch (err) {
        returnError(device.ipaddress)
      }
    } else if (device.type === 'QSys') {
      try {
        const r = await qsys.getStatus({ host: device.ipaddress, port: device.port })
        if (r) {
          const result = await Devices.updateOne({
            ipaddress: device.ipaddress
          }, {
            $set: {
              status: r.Status.Code === 0 ? true: false,
              info: r
            }
          })
        } else {
          returnError(device.ipaddress)
        }
      } catch (error) {
        returnError(device.ipaddress)
      }
    }
  })
}

async function returnError (ipaddress) {
  return await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
}
