const mongoose = require('mongoose')
const Logs = require('../../models/eventlog')

mongoose.connect('mongodb://localhost/mediaserver')

const db = mongoose.connection

db.once('open', () => {
  console.log('MongoDB connected...')
  const dbStartLog = new Logs({
    source: 'Server',
    category: 'info',
    zones: '서버',
    message: 'Server start with database!'
  })
  dbStartLog.save()
})

db.on('error', () => {
  console.error('db connection error')
})

module.exports = db
