const express = require('express')
const router = express.Router()
const Zones = require('../../models/zones')
const Barix = require('../../models/barix')

router.get('/', async (req, res) => {
  const { location } = req.query
  try {
    const r = await Zones.aggregate([
      {
        $lookup: {
          from: 'barixes',
          localField: 'mac',
          foreignField: 'mac',
          as: 'Barix'
        }
      }
    ])
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    let r = await Zones.findOne({ index: req.body.index })
    if (r) return res.status(500).json({ message: 'Index가 중복 되었습니다.'})
    // r = await Zones.findOne({ where: { name: req.body.name } })
    // if (r) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    r = await Zones.create(req.body)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    let r = await Zones.findOne({ index: req.body.index })
    if (r && r._id.toString() !== req.body._id) return res.status(500).json({ message: 'Index가 중복되었습니다.' })
    // r = await Zones.findOne({ name: req.body.name })
    // if (r && r._id !== req.body._id) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    r = await Zones.updateOne({ _id: req.body._id }, { $set: req.body })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  try {
    let r = await Zones.deleteOne({ _id: req.query._id })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
