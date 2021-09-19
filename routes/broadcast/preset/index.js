const express = require('express')
const router = express.Router()

const ZonePreset = require('models/zonePreset')

router.get('/', async function (req, res) {
  try {
    const { user_id } = req.query

    const search = { type: 'global' }
    if (user_id && user_id !== 'undefined') {
      search['user_id'] = user_id
    }
    console.log(search)
    const r = await ZonePreset.find(search)
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const newPreset = new ZonePreset(req.body)
    const r = await newPreset.save()
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ error: err })
  }

})

module.exports = router