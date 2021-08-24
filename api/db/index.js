const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mediaserver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  connectTimeoutMS: 1000
})

const db = mongoose.connection

db.once('open', () => {
  console.log('MongoDB connected...')
})

db.on('error', () => {
  console.error('db connection error')
})

module.exports = db
