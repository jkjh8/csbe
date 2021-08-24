const express = require('express')
const router = express.Router()
const Logs = require('../../models/eventLog')

router.get('/', async (req, res) => {
  try {
    let { limit, page, search } = req.body

    let findQuery = {}
    const searchOptions = []
    const paginateOptions = { page: page ?? 1, limit: limit ?? 10, sort: { createdAt: -1 } }

    if (searchOptions.length > 0) {
      findQuery = { $and: searchOptions }
    }

    const r = await Logs.paginate(findQuery, paginateOptions)
    res.status(200).json({ rowsPerPage: limit, page: page, rows: r })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
