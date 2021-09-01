const Device = require('../../../models/devices')
const Devices = require('../../../models/devices')
const qsys = require('./index')

module.exports.get = (ipaddress) => {
  const deviceInfo = await qsys.getStatus({ host: ipaddress, port: 1710 })
  try {
    if (deviceInfo) {
      await Devices.updateOne({
        ipaddress: ipaddress
      }, {
        $set: { status: deviceInfo.Status.Code === 0 ? true : false, info: { $set: {deviceInfo } }
      })
    } else {
      await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
    }
  } catch (error) {
    await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
  }
}

module.exports.getComponents = (ipaddress) => {
  const data = await qsys.getComponents(ipaddress)
  try {
    if (data) {
      return Devices.updateOne({
        ipaddress: ipaddress
      }, {
        $set: {
          controls: data
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports.componentsGetControls = (ipaddress, componentName) => {
  const data = await qsys.componentGetControls(ipaddress, componentName)
  console.log(data)
} 