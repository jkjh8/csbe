const express = require('express')
const router = express.Router()
const dbLogs = require('../../models').Logs
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.post('/', async (req, res) => {
  try {
    const { limit, page, search } = req.body
    console.log(req.body)
    const offset = limit * (page - 1)
    const r = await dbLogs.findAndCountAll({
      where: {
        [Op.or]: [
          { message: { [Op.like]: `%${search}%` } },
          { source: { [Op.like]: `%${search}%` } },
          { zones: { [Op.like]: `%${search}%` } }
        ]
      },
      limit: Number(limit),
      offset: offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    
    return res.status(200).json({ logsPerPage: limit, page: page, data: r })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router
