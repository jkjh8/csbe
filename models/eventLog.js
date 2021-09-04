const mongoose = require('mongoose')
const { searchArrToStr, makeSearchField } = require('../api/tools')
const mongoosePaginate = require('mongoose-paginate-v2')

const logsSchema = new mongoose.Schema({
  source: { type: String, requird: true },
  category: { type: String, required: true, default: 'info' }, //warning, error
  priority: { type: String, required: true, default: 'low' }, //mid, high
  zones: { type: Array },
  message: { type: String, required: true },
  search: { type: String }
}, {
  timestamps: true
})
logsSchema.index({ '$**': 'text' })
logsSchema.plugin(mongoosePaginate)

makeSearchField(logsSchema, 'search', (postDoc) => {
  const arr = []
  const { source = '', zones = [], message = '' } = postDoc
  arr.push(source)
  arr.push(zones.join(','))
  arr.push(message)
  return searchArrToStr(arr)
})

const Logs = mongoose.model('Logs', logsSchema)
module.exports = Logs