const express = require('express')
const router = express.Router()

const ZonePreset = require('models/zonePreset')

router.get('/', async function (req, res) {
  try {
    const { user_id } = req.query

    const search = [{ type: 'global' }]
    if (user_id && user_id !== 'undefined') {
      search.push({ user_id: user_id })
    }
    console.log(search)
    const r = await ZonePreset.find({ $or: search })
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const newPreset = new ZonePreset(req.body)
    const r = await newPreset.save()
    res.status(200).json({ r })
  } catch (err) {
    res.status(500).json({ error: err })
  }

})

router.get('/delete', async (req, res) => {
  try {
    const id = req.query.id
    console.log('id = ', id)
    const r = await ZonePreset.deleteOne({ _id: id })
    res.status(200).json(r)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
