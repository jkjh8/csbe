
const express = require('express')
const router = express.Router()
const Devices = require('../../../models/devices')

router.get('/', async function (req, res) {
  try {
    const r = await Devices.find()
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.post('/', async function (req, res) {
  try {
    console.log(req.body.mac.toUpperCase())
    let r = await Devices.findOne({ index: req.body.index })
    if (r) return res.status(500).json({ message: 'Index가 중복되었습니다.' })
    r = await Devices.findOne({ mac: req.body.mac.toUpperCase() })
    if (r) return res.status(500).json({ message: 'Mac 주소가 이미 존재 합니다.'})
    const createItem = new Devices({
      index: req.body.index,
      name: req.body.name,
      checked: true,
      mac: req.body.mac,
      info: req.body.info
    })
    r = await createItem.save()
    console.log(r)
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.put('/', async function (req, res) {
  try {
    let r = await Devices.findOne({ index: req.body.index })
    if (r && r._id.toString() !== req.body._id) return res.status(500).json({ message: 'Index가 중복되었습니다.' })
    r = await Devices.updateOne({
      _id: req.body._id
    }, {
      $set: {
        name: req.body.name,
        index: req.body.index,
        checked: true
      }
    })
    res.status(200).json({ data: r })
  } catch (err) {
    res.status(500).json({ status: 'error', data: err })
  }
})

router.get('/delete', async (req, res) => {
  try {
    let r = await Devices.deleteOne({ _id: req.query._id })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
  }
})

module.exports = router
