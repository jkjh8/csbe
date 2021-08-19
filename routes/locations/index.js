const express = require('express')
const router = express.Router()
const Locations = require('../../models').Locations
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/', async (req, res) => {
  try {
    const r = await Locations.findAndCountAll()    
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    if (!req.body.port) return res.status(500).json({ message: 'Port를 확인해주세요.' })
    let r = await Locations.findAll({ where: { index: req.body.index } })
    if (r.length) return res.status(500).json({ message: 'Index가 중복 되었습니다.'})
    r = await Locations.create(req.body)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '서버에러가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    const r = await Locations.update(req.body, { where: { _id: req.body._id } })
    console.log(r)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err})
  }
})

module.exports = router
