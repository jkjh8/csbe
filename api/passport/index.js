const passport = require('passport')
const bcrypt = require('bcrypt')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '../../.env') })

const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const Users = require('models/users')

const getAccessToken = function (req) {
  if (req && req.cookies && req.cookies['accessToken']) {
    console.log('getAccessToken')
    const token = req.cookies['accessToken']
    return token
  } else {
    console.log('can not get token')
    return null
  }
}

const getRefreshToken = function (req) {
  if (req && req.cookies && req.cookies['refreshToken']) {
    return req.cookies['refreshToken']
  }
  return null
}

const localOption = { usernameField: 'userId', passwordField: 'password' }
const jwtOption = { jwtFromRequest: getAccessToken, secretOrKey: process.env.JWT_SECRET }
const jwtRefOption = { jwtFromRequest: getRefreshToken, secretOrKey: process.env.JWT_SECRET }

async function localVerify(id, password, done) {
  try {
    const user = await Users.findOne({ userId: id }, { _id: 0 })
    if (!user) return done(null, false, { message: '사용자를 찾을 수 없습니다.' })
    if (bcrypt.compareSync(password, user.password)) {
      delete user[password]
      return done(null, user)
    } else {
      return done(null, false, { message: '패스워드가 일치하지 않습니다.'})
    }
  } catch (error) {
    done(null, false, { message: '알 수 없는 오류가 발생하였습니다.', error: error })
  }
}

async function jwtVerify(payload, done) {
  try {
    const user = await Users.findOne({ userId: payload.userId }, { _id: 0, password: 0 })
    if (!user) return done(null, false, { message: '사용자를 찾을 수 없습니다.'})
    done(null, user, payload)
  } catch (error) {
    done(null, false, { message: '알 수 없는 오류가 발생하였습니다.', error: error })
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(localOption, localVerify))
  passport.use('access', new JWTStrategy(jwtOption, jwtVerify))
  passport.use('refresh', new JWTStrategy(jwtRefOption, jwtVerify))
}
