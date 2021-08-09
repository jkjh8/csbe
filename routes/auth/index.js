const express = require('express')
const router = express.Router()

const path = require('path')
const dotenv = require('dotenv')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const dbUsers = require('../../models').Users

dotenv.config({ path: path.join(__dirname, '../../.env') })

router.post('/register', function (req, res) {
  const { user } = req.body
  if (!user.user_id) { user.user_id = user.email }
  dbUsers.findOne({
    where: { user_id: user.user_id }
  }).then((result) => {
    if (result) {
      return res.status(403).json({ message: '이미 가입되어 있는 이메일 입니다.'})
    }
  })
  dbUsers.create(user).then((res) => {
    console.log('register = ', res)
    res.sendStatus(200)
  }).catch((err) => {
    res.sendStatus(500)
  })
})

module.exports = router
