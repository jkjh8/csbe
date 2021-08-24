const express = require('express')
const router = express.Router()
const Zones = require('../../models/zones')
const Barix = require('../../models/barix')

router.get('/', async (req, res) => {
  const { location } = req.query
  try {
    const r = await Zones.findAll({
      include: [Barix] })    
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    let r = await Zones.findOne({ where: { index: req.body.index } })
    if (r) return res.status(500).json({ message: 'Index가 중복 되었습니다.'})
    r = await Zones.findOne({ where: { name: req.body.name } })
    if (r) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    r = await Zones.create(req.body)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    let r = await Zones.findOne({ where: { index: req.body.index } })
    if (r && r._id !== req.body._id) return res.status(500).json({ message: 'Index가 중복되었습니다.' })
    r = await Zones.findOne({ where: { name: req.body.name } })
    if (r && r._id !== req.body._id) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    r = await Zones.update(req.body, { where: { _id: req.body._id } })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.post('/delete', async (req, res) => {
  console.log(req.body)
  try {
    let r = await Zones.destroy({ where: { _id: req.body._id } })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
