const express = require('express')
const router = express.Router()
const Locations = require('../../models/location')

router.get('/', async (req, res) => {
  try {
    const r = await Locations.find({})    
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.port) return res.status(500).json({ message: 'Port를 확인해주세요.' })
    let r = await Locations.findOne({ where: { index: req.body.index } })
    if (r) return res.status(500).json({ message: 'Index가 중복 되었습니다.'})
    r = await Locations.findOne({ where: { name: req.body.name } })
    if (r) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    const c = new Locations(req.body)
    r = await c.save()
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    let r = await Locations.findOne({ where: { index: req.body.index } })
    if (r && r._id !== req.body._id) return res.status(500).json({ message: 'Index가 중복되었습니다.' })
    r = await Locations.findOne({ where: { name: req.body.name } })
    if (r && r._id !== req.body._id) return res.status(500).json({ message: '이름이 중복되었습니다.'})
    r = await Locations.updateOne({ _id: req.body._id }, { $set: req.body } )
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.get('/delete', async (req, res) => {
  const { _id } = req.query
  try {
    let r = await Locations.deleteOne({ _id: _id })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
