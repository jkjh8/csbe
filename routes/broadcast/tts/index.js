/** @format */

const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const request = require('request')

const TTS = require('models/ttsText')
const ttsPython = require('api/py')

router.post('/preview', ttsPython.preview)
router.get('/voices', ttsPython.getVoices)

router.get('/list', async function (req, res) {
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

router.post('/list', async (req, res) => {
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

router.put('/list', async (req, res) => {
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

router.get('/deleteList', async (req, res) => {
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

router.post('/kakao', async (req, res) => {
  try {
    const { voice, rate, volume, text } = req.body
    const fileName = `${uuidv4()}.mp3`
    const filePath = path.join(tempPath, fileName)
    const reqestText = `<speak><voice name="${voice}"><prosody rate="${rate}" volume="${volume}">${text}</prosody></voice></speak>`
    const options = {
      uri: 'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `KakaoAK ${process.env.KAKAO_SECRET}`
      },
      body: reqestText
    }
    request(options)
      .on('error', function(err) {
        console.error(err)
      })
      .on('end', function () {
        console.log('end')
        res.status(200).json({
          file: fileName,
          src: fileName,
          name: 'KAKAO TTS',
          base: 'temp'
        })
      })
      .pipe(fs.createWriteStream(filePath))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
