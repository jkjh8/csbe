const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  index: { type: Number },
  active: { type: Boolean },
  gain: { type: Number },
  name: { type: String },
  mute: { type: Boolean },
  page: {
    gain: { type: Number },
    mute: { type: Boolean }
  },
  priority: { type: Number },
  source: { type: Number },
  squelch: {
    value: { type:Number },
    active: { type: Boolean }
  },
  bgm: {
    gain: { type: Number }
  }
})

const qsysSchema = new mongoose.Schema({
  ipaddress: { type: String, unique: true, required: true },
  pagechannel: { type: Number, default: 16 },
  bgmchannel: { type: Number, default: 4 },
  zone:[pageSchema],
  failedAt: { type: Date }
}, { upsert: true })



qsysSchema.pre('updateOne', (next) => {
  this.updatedAt = Date.now()
  next()
}, {
  timestamps: true
})

const QsysPage = mongoose.model('QsysPage', pageSchema)
const Qsys = mongoose.model('Qsys', qsysSchema)
module.exports = Qsys
module.exports.page = QsysPage
