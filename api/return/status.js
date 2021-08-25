const Barix = require('../../models/barix')

setInterval(async () => {
  const r = await Barix.find()
  io.emit('devices', r)
}, 60000)