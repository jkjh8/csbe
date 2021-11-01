const Devices = require('models/devices')

exports.get = async (socket) => {
  const r = await Devices.find()
  socket.emit('devices', r)
}