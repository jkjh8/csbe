const path = require('path')
const express = require('express')
const app = express()
const port = 3000

//load modules
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')

//DB model sync
// const sequelize = require('./models').sequelize
// sequelize.sync()

require('./api/passport')()


//server setup
app.use(cors())
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('morgan')('dev')) //debuger
app.use(express.static(path.join(__dirname, 'public')))

//load router
app.use('/', require('./routes'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  // require('./models').Logs.create({
  //   source: '메인서버',
  //   category: 'info',
  //   priority: 'low',
  //   zones: '본사',
  //   message: '웹서버가 재부팅 되었습니다.'
  // })
})
