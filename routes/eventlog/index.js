const express = require('express')
const router = express.Router()
const dbLogs = require('../../models').Logs

router.get('/', (req, res) => {
  const { limit, page, serarch, location } = req.query
  const offset = limit * (page - 1)
  console.log(limit)
  console.log(offset)
  dbLogs.findAndCountAll({
    limit: Number(limit),
    offset: offset,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then((result) => {
    console.log(result)
    res.status(200).json({
      logsPerPage: limit,
      page: page,
      data: result
    })
  }).catch((err) => {
    console.log(err)
    res.status(500).json({ error: err })
  })
})

module.exports = router
