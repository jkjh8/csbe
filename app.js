/** @format */

const path = require('path')
const fs = require('fs')
const express = require('express')
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
global.tempPath = path.join(__dirname, 'temp')

makeMediaFolder(filesPath)
makeMediaFolder(tempPath)

app.use('/media', express.static(filesPath))
app.use('/temp', express.static(tempPath))

//load router
app.get('/', (req, res, next) => {
  res.render('index', { title: 'Centeral Control Server' })
})
app.use('/api', require('./routes'))

//socket io
const httpServer = http.createServer(app)
// const httpsServer = https.createServer(credentials, app)
global.io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('connected! ')
})

httpServer.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
// httpsServer.listen(port, () => {
//   console.log(`App listening at https://localhost:${port}`)
// })
const devices = require('./api/devices')
devices.get()
// require('./api/devices/checkBarix')
// require('./api/return/status')
// require('./api/devices/barix')
// require('./api/devices/qsys')

// const Log = require('./models/eventlog')
// const Hangul = require('hangul-js')
// const searchStr = Hangul.disassembleToString('서')
// Log.find({ search: null }, function (err, res) {
//   console.log(res)
// })
