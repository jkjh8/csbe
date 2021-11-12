
const fnDevices = require('api/devices')
const broadcast = require('api/broadcast')
const multicastAddress = '230.185.192.12'

let timer = null

exports = module.exports = function(app) {
  app.io.on('connection', (socket) => {
    socket.emit('connection', `connected ${socket.id}`)
    console.log('Socket io connected ', socket.id)
    socket.on('disconnect', () => {
      console.log('Socket io disconnect', socket.id)
    })
    socket.on('getDevices', async () => {
      console.log('get Devices')
      await fnDevices.get(socket)
    })

    socket.on('broadcastStart', async (locate) => {
      // console.log('Broadcast', obj.channels)
      await broadcast.onair(locate)
      const msg = new Buffer.from(JSON.stringify({
        playerId: 1,
        command: 'play',
        file: locate.file,
        startChime: locate.startChime,
        endChime: locate.endChime,
        vol: locate.vol
      }))
      app.server.send(msg, 12341, multicastAddress)
      if (!timer) {
        timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
        setTimeout(() => {
          clearInterval(timer)
          timer = null
        }, 5000)
      }
    })

    socket.on('broadcastEnd', async (locate) => {
      await broadcast.offair(locate)
      const msg = new Buffer.from(JSON.stringify({
        playerId: 1,
        command: 'stop'
      }))
      app.server.send(msg, 12341, multicastAddress)
      if (!timer) {
        timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
        setTimeout(() => {
          clearInterval(timer)
          timer = null
        }, 5000)
      }
    })

    socket.on('broadcastcancel', async (locate) => {
      await broadcast.cancel(locate)
      if (!timer) {
        timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
        setTimeout(() => {
          clearInterval(timer)
          timer = null
        }, 5000)
      }
    })
  })
}