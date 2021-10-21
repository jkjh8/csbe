/** @format */

const express = require('express')
const router = express.Router()

const Users = require('../../models/users.js')

router.get('/', async (req, res) => {
  const users = await Users.find({}, { password: 0 })
  res.status(200).json({ users: users })
})

router.get(`/admin`, async (req, res) => {
  try {
    const { id, value } = req.query
    console.log(id, value)
    const r = await Users.updateOne(
      {
        _id: id
      },
      {
        $set: { admin: value }
      }
    )
    res.status(200).json({ data: r })
  } catch (err) {
    res
      .status(500)
      .json({ data: err, message: '알 수 없는 에러가 발생하였습니다' })
  }
})

router.put('/color', async (req, res) => {
  try {
    const { email, color } = req.body
    console.log(email, color)
    const r = await Users.updateOne({ email: email }, { $set: { color: color }})
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ error: err, message: '서버 에러가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  try {
    const { id } = req.query
    const r = await Users.findByIdAndDelete(id)
    console.log('result', r)
    res.status(200).json(r)
  } catch (err) {
    res
      .status(500)
      .json({ data: err, message: '알 수 없는 에러가 발생하였습니다' })
  }
})

module.exports = router
