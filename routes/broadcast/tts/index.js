/** @format */

const express = require('express')
const router = express.Router()

const TTS = require('models/ttsText')

router.get('/', async function (req, res) {
  try {
    const { user_id } = req.query
    const search = [{ type: 'global' }]
    if (user_id && user_id !== 'undefined') {
      search.push({ user_id: user_id })
    }
    console.log(search)
    const r = await TTS.find({ $or: search })
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const newMessage = new TTS(req.body)
    const r = await newMessage.save()
    res.status(200).json({ r })
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: '메세지 저장중에 문제가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    const info = req.body
    const r = await TTS.updateOne(
      {
        _id: info._id
      },
      {
        $set: info
      }
    )
    res.status(200).json({ r })
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: '메세지 저장중에 문제가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  try {
    const id = req.query.id
    console.log('id = ', id)
    const r = await TTS.deleteOne({ _id: id })
    res.status(200).json(r)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
