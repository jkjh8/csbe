const express = require('express')
const router = express.Router()
const dbLogs = require('../../models').Logs

router.get('/', (req, res) => {
  const { limit, page, serarch, location } = req.query
  dbLogs.findAll({
    limit: limit ?? 10,
    offset: page ?? 1
  }).then((result) => {
    res.status(200).json({
      logsPerPage: limit ?? 10,
      page: page ?? 1,
      data: result
    })
  }).catch((err) => {
    res.status(500).json({ error: err })
  })
})

module.exports = router
