const db_logs = require('../../models').Logs

module.exports.get = async (req, res) => {
  const { limit, page } = req.query
  const result = await db_logs.findAll({
    limit: limit ?? 10,
    offset: page ?? 1
  })
  res.status(200).json({ result: result })
}
