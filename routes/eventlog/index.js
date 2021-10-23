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

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const log = { ...req.body }
    const eventlog = new Logs({
      source: log.source,
      category : log.category ? log.category: 'info',
      zones: log.zones,
      priority: log.priority ? log.priority: 'low',
      message: log.message
    })
    await eventlog.save()
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error, message: error.message })
  }
})

module.exports = router
