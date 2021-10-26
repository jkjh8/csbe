
const fnLocations = require('./locations')

exports = module.exports = function(app) {
  app.io.on('connection', (socket) => {
    console.log('Socket io connected ', socket.id)
    socket.on('disconnect', () => {
      console.log('Socket io disconnect', socket.id)
    })
    socket.on('getLocations', async () => {
      await fnLocations.get(socket)
    })

    socket.on('broadcastStart', (obj) => {
      console.log('Broadcast', obj.channels)
    })
  })
}