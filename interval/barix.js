const dbBarix = require('../models').Barix

setInterval(async () => {
  const r = await dbBarix.findAndCountAll()
  io.emit('deviceList', r)
  console.log('emit')
}, 60000);