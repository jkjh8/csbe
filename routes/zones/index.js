const express = require('express')
const router = express.Router()
const Zones = require('../../models/zones')
const Qsys = require('../../models/qsys')
const { setTxAddress } = require('../../api/devices/qsys')

router.get('/', async (req, res) => {
  const { location } = req.query
  try {
    const r = await Zones.find().sort({ index: 1 })
    return res.status(200).json({ data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

async function check (info) {
  let r = await Zones.findOne({ index: info.index })
  if (r && r._id.toString() !== info._id) return '인텍스가 중복 되었습니다.'
  r = await Zones.findOne({ 'device.ipaddress': info.device.ipaddress })
  if (r && r._id.toString() !== info._id) return '디바이스가 중복 선택 되었습니다.'
  r = await Zones.findOne({ parent: info.parent, channel: info.channel })
  if (r && r._id.toString() !== info._id) return '채널이 중복 설정 되었습니다.'
}

router.post('/', async (req, res) => {
  try {
    const info = req.body
    const chk = await check(info)
    if (chk) return res.status(500).json({ message: chk })
    r = await Zones.create(req.body)
    await qsysTxDub(info)
    await setTxAddress(info.parent.ipaddress, info.channel, info.device.ipaddress)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

router.put('/', async (req, res) => {
  try {
    const info = req.body
    const chk = await check(info)
    if (chk) return res.status(500).json({ message: chk })

    await qsysTxDub(info)
    await setTxAddress(info.parent.ipaddress, info.channel, info.device.ipaddress)


    r = await Zones.updateOne({ _id: req.body._id }, { $set: req.body })
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
  }
})

async function qsysTxDub (info) {
  const qsys = await Qsys.find().select({ ipaddress: 1, tx: 1 })
  for (let i = 0; i < qsys.length; i++) {
    for (let j = 0; j < qsys[i].tx.length; j++) {
      for (let n = 0; n < qsys[i].tx[j].length; n++) {
        if (qsys[i].tx[j][n].Name === 'host') {
          if (qsys[i].tx[j][n].String === info.device.ipaddress) {
            if (info.device.ipaddress === qsys[i].ipaddress && info.channel === (j + 1)) {
              console.log('pass')
            } else {
              console.log(`ipaddress=${qsys[i].ipaddress}, channel=${j+1}`)
              await setTxAddress(qsys[i].ipaddress,  j + 1, ' ')
            }
          }
        }
      }
    }
  }
}

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
