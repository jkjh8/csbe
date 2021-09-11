const express = require('express')
const router = express.Router()

const Users = require('../../models/users.js')

router.get('/', async (req, res) => {
  const users = await Users.find({}, { password: 0 })
  res.status(200).json({ users: users })
})

module.exports = router