const Barix = require('../../models/barixes')

setInterval(async () => {
  const r = await Barix.find()
  io.emit('devices', r)
}, 60000)