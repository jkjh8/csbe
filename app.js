const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const port = 3000

//load modules
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')

//DB model sync
require('./api/db')
// const sequelize = require('./models').sequelize
// sequelize.sync()


require('./api/passport')()


//server setup
app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin)
  },
  credentials: true
}))
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('morgan')('dev')) //debuger
app.use(express.static(path.join(__dirname, 'public')))

//load router
app.use('/', require('./routes'))


//socket io
const server = http.createServer(app)
global.io = require('socket.io') (server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('connected! ')
})


server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

require('./api/devices/checkBarix')
require('./api/return/status')
