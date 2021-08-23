const express = require('express')
const router = express.Router()

const path = require('path')
const dotenv = require('dotenv')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const makeToken = require('../../api/users/makeToken')
const dbUsers = require('../../models').Users

const bcrypt = require('bcrypt')
const saltRounds = 10

dotenv.config({ path: path.join(__dirname, '../../.env') })

router.post('/register', function (req, res) {
  const user = req.body
  dbUsers.findOne({
    where: { user_id: user.user_id }
  }).then((result) => {
    if (result) {
      return res.status(403).json({ message: '이미 가입되어 있는 이메일 입니다.'})
    }
  })

  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    if (err) {
      res.status(500).json({ result: err, message: '비밀번호 암호화 에러' })
    }
    user.password = hash
    dbUsers.create(user).then((result) => {
      res.status(200).json({ result: result })
    }).catch((error) => {
      res.status(500).json({ result: error, message: '데이터베이스 에러' })
    })
  })
})

router.post('/login', function(req, res) {
  passport.authenticate('local', {
    session: false
  }, (err, user, info) => {
    console.log('User', user)
    if (err) return res.status(403).json({ error: err })
    if (!user) return res.status(403).json(info)

    dbUsers.update({ number_of_login:user.number_of_login + 1, loginAt: moment() }, { where: { user_id: user.user_id } }).then(result => {
      const token = makeToken({ name: user.name, user_id: user.user_id, email: user.email})
      //Send Accesstoken
      res.cookie('accessToken', token.accessToken, { httpOnly: true })
      //Refresh token
      if (req.body.keepLoggedin) {
        res.cookie('refreshToken', token.refreshToken, { httpOnly: true })
      } else {
        res.clearCookie('refreshToken')
      }

      return res.status(200).json({ user: user }).end()
    }).catch(err => {
      console.log(err.message)
      return res.status(500).json({ user: false, message: err})
    })
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
      const token = makeToken({ name: user.name, user_id: user.user_id, email: user.email })
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
      const token = makeToken({ name: user.name, user_id: user.user_id, email: user.email })
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
