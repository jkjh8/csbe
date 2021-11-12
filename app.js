/** @format */

const path = require('path')
const fs = require('fs')
const cron = require('node-cron')
const express = require('express')
const dgram = require('dgram')

const app = express()
const http = require('http')
const https = require('https')
const port = 3000
const sslPort = 3443
// keys
// const privateKey = fs.readFileSync('./keys/private.key', 'utf8')
// const cerificate = fs.readFileSync('./keys/mediaserver.crt', 'utf8')
// const credentials = { key: privateKey, crt: cerificate }

//load modules
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const history = require('connect-history-api-fallback')
const fileUpload = require('express-fileupload')

// 가변 경로 설정
require('app-module-path').addPath(__dirname)

//DB model sync
require('./api/db')
// const sequelize = require('./models').sequelize
// sequelize.sync()

require('./api/passport')()

//server setup
app.use(history())
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin)
    },
    credentials: true
  })
)
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('morgan')('dev')) //debuger
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')))

// 폴더 확인 및 생성

function makeMediaFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
}

global.filesPath = path.join(__dirname, 'files')
global.soundPath = path.join(__dirname, 'sound')
global.schedulePath = path.join(__dirname, 'schedules')
global.tempPath = path.join(__dirname, 'temp')
global.deviceStatus = {}

makeMediaFolder(filesPath)
makeMediaFolder(soundPath)
makeMediaFolder(schedulePath)
makeMediaFolder(tempPath)

makeMediaFolder(path.join(filesPath, 'home'))

app.use('/media', express.static(filesPath))
app.use('/schedule', express.static(schedulePath))
app.use('/temp', express.static(tempPath))
app.use('/sound', express.static(soundPath))

//load router
app.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})
app.use('/api', require('./routes'))

//socket io
const httpServer = http.createServer(app)
// const httpsServer = https.createServer(credentials, app)
app.io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
})
const socketIOHandler = require('./api/socketio')(app)

// multicast server
const multicastAddress = '230.185.192.12'
app.server = dgram.createSocket('udp4')
const multicastIoHandler = require('./api/multicast')(app)
// app.server.bind(12340)


httpServer.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
// httpsServer.listen(port, () => {
//   console.log(`App listening at https://localhost:${port}`)
// })
const devices = require('./api/devices')

const schedule = require('./api/schedule')

devices.get(app.io)

cron.schedule('15,45 * * * * *', () => {
  console.log('get master')
  devices.getMasters(app.io)
})

cron.schedule('*/5 * * * *', () => {
  console.log('get slave')
  devices.getStatus(app.io)
})

cron.schedule('0 * * * * *', () => {
  console.log('schedule')
  schedule.checkSchedule()
})

app.broadcast = null
global.app = app
module.exports = app
