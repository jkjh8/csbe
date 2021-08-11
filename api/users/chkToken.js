const path = require('path')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const dotenv = require('dotenv')
const { userInfo } = require('os')

dotenv.config({ path: path.join(__dirname, '../../.env') })

module.exports = function (payload) {
  const time1 = moment()
  const time2 = moment(payload.exp * 1000)

  let token = {}
  token.accessToken = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1h' })
  if (moment.duration(time2.diff(time1)).asDays() < 1 ) {
    token.refreshToken = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '7d' })
  }

  return token
}