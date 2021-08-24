const express = require('express')
const router = express.Router()
const Logs = require('../../models/eventlog')

router.get('/', async (req, res) => {
  try {
    const { limit, page, search } = req.query

    const searchOptions = []

    if (search && search !== 'undefined') {
      searchOptions.push({ $text: { $search: search } })
    }
    const paginateOptions = { page: page, limit: limit, sort: { createdAt: -1 } }

    const r = await Logs.paginate(searchOptions.length ? { $and: searchOptions } : {}, paginateOptions)
    res.status(200).json(r)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
