const express = require('express')
const router = express.Router()

const path = require('path')
const dotenv = require('dotenv')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const makeToken = require('../../api/users/makeToken')
const Users = require('../../models/users')

const bcrypt = require('bcrypt')
const saltRounds = 10

dotenv.config({ path: path.join(__dirname, '../../.env') })

router.post('/register', async function (req, res) {
  try {
    const user = await Users.findOne({ userId: req.body.userId})
    if (user) return res.status(403).json({ message: '이미 가입되어 있는 이메일 입니다.'})
    const newUser = new Users(req.body)
    const r = await newUser.save()
    if (r) res.status(200).json({ result: r })
  } catch (error) {
    res.status(500).json({ result: error, message: '서버 오류가 발생하였습니다.' })
  }
})

router.post('/login', function (req, res) {
  passport.authenticate('local', {
    session: false
  }, async (err, user, info) => {
    try {
      if (err) return res.status(403).json({ error: err })
      if (!user) return res.status(403).json(info)

      const r = await Users.updateOne({ userId: user.userId }, { numberOfLogin: user.numberOfLogin + 1, loginAt: moment() })
      if (r) {  
        const token = makeToken({ name: user.name, userId: user.userId, email: user.email})
        //Send Accesstoken
        res.cookie('accessToken', token.accessToken, { httpOnly: true })
        //Refresh token
        if (req.body.keepLoggedin) {
          res.cookie('refreshToken', token.refreshToken, { httpOnly: true })
        } else {
          res.clearCookie('refreshToken')
        }
      }
      res.status(200).json({ user: user }).end()
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ user: false, message: error })
    }
  }) (req, res)
})

router.get('/getUser', function (req, res) {
  passport.authenticate('access', { session: false }, function (err, user, info) {
    if (err) {
      return res.status(403).json({
        user: null,
        message: '사용자가 존재하지 않습니다.'
      })
    }
    if (user) {
      const token = makeToken({ name: user.name, userId: user.userId, email: user.email })
      res.cookie('accessToken', token.accessToken, { httpOnly: true })
    }
    res.status(200).json({ user: user, info: info }).end()
  }) (req, res)
})

router.get('/refUser', function(req, res) {
  passport.authenticate('refresh', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(403).json({
        user: null,
        message: '사용자가 존재하지 않습니다.'
      })
    }
    if (user) {
      const token = makeToken({ name: user.name, userId: user.userId, email: user.email })
      res.cookie('accessToken', token.accessToken, { httpOnly: true })
    }
    res.status(200).json({ user: user, info: info }).end()
  }) (req, res)
})

router.get('/logout', function (req, res) {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  req.logout()
  return res.status(200).json({
    user: null,
    message: 'Logout complate'
  })
})

module.exports = router
