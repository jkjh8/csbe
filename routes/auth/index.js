const express = require('express')
const router = express.Router()

const path = require('path')
const dotenv = require('dotenv')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const dbUsers = require('../../models').Users

const bcrypt = require('bcrypt')
const saltRounds = 10

dotenv.config({ path: path.join(__dirname, '../../.env') })

router.post('/register', function (req, res) {
  const user = req.body
  if (!user.user_id) { user.user_id = user.email }
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

module.exports = router
