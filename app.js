const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

//DB model sync
// const sequelize = require('./models').sequelize
// sequelize.sync()

app.use(cors())
app.use(require('morgan')('dev')) //debuger
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
