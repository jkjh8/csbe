const express = require('express')
const router = express.Router()
const dbLogs = require('../../models').Logs

router.get('/', (req, res) => {
  const { limit, page, serarch, location } = req.query
  const offset = limit * page - 1
  dbLogs.findAndCountAll({
    limit: limit ?? 10,
    offset: page ?? 0,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then((result) => {
    console.log(result)
    res.status(200).json({
      logsPerPage: limit ?? 10,
      page: page ?? 0,
      data: result
    })
  }).catch((err) => {
    res.status(500).json({ error: err })
  })
})

module.exports = router
