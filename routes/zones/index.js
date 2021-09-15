const express = require('express')
const router = express.Router()
const Zones = require('../../models/zones')
const Qsys = require('../../models/qsys')
const { qsysTxDub, setTxAddress, qsysTxClear } = require('../../api/devices/qsys')

router.get('/', async (req, res) => {
  const { id } = req.query
  const search = {}
  if (id && id !== 'undefined') {
    search['parent._id'] = id
  }

  try {
    const r = await Zones.find(search).sort({ index: 1 })
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.get('/status', async (req, res) => {
  try {
    const r = await Zones.aggregate([{
      $lookup: {
        from: 'Qsys',
        localField: 'parent.ipaddress',
        foreignField: 'ipaddress',
        as: 'qsys'
      }
    }])
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({ message: 'error' })
  }
})

async function check (info) {
  let r = await Zones.findOne({ index: info.index })
  if (r && r._id.toString() !== info._id) return '인텍스가 중복 되었습니다.'
  if (info.device && info.device.ipaddress) {
    r = await Zones.findOne({ 'device.ipaddress': info.device.ipaddress })
    if (r && r._id.toString() !== info._id) return '디바이스가 중복 선택 되었습니다.'
  }
  r = await Zones.findOne({ parent: info.parent, channel: info.channel })
  if (r && r._id.toString() !== info._id) return '채널이 중복 설정 되었습니다.'
}

async function setDevice (info) {
  console.log(info)
  if (info.parent && info.parent.ipaddress && info.device && info.device.ipaddress) {
      await qsysTxDub(info)
      setTimeout(async () => {
        await setTxAddress(info.parent.ipaddress, info.channel, info.device.ipaddress)
      }, 10);
      return false
  } else {
    return true
  }
}

router.post('/', async (req, res) => {
  try {
    const info = req.body
    const chk = await check(info)
    if (chk) return res.status(500).json({ message: chk })
    const r = await Zones.create(info)
    r.check = await setDevice(info)
    await r.save()
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    let info = req.body
    const chk = await check(info)
    if (chk) return res.status(500).json({ message: chk })
    console.log(info.check)
    info.check = await setDevice(info)
    r = await Zones.updateOne({ _id: info._id }, { $set: info })
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
