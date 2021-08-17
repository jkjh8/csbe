const express = require('express')
const router = express.Router()
const dbBarix = require('../models').Barix


router.get('/submit', function (req, res) {
  const { mac, alarm, info } = req.query
  const rinfo = info.split(',')
  const rJson = {}
  rinfo.forEach((item) => {
    let r = item.split('=')
    rJson[r[0]] = r[1]
  })
  console.log(rJson)
  dbBarix.findAll({
    where: {
      mac: mac
    }
  }).then((result) => {
    if (result.length > 0) {
      dbBarix.update({ alarm, info: rJson }, { where: { mac } }).then((r) => {
        console.log('update! ', r)
      })
    } else {
      dbBarix.create({
        mac, alarm, info: rJson
      }).then((r) => {
        console.log('새로운 장비가 등록되었습니다.', r.mac, r.info.IP_address)
      })
    }
  })
  res.sendStatus(200)
})

module.exports = router