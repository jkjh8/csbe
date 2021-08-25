const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../../.env') })

module.exports.makeTokens = function (userInfo) {
  return {
    accessToken: jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1h' }),
    refreshToken: jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '7d' })
  }
}