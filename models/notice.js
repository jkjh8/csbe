const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  userId: { type: String },
  from: { type: String },
  type: { type: String },
  message: { type: String },
  link: { type: String },
  user_level: { type: Number, default: 0 },
  checked: { type: Boolean, default: false },
}, {
  timestamps: true
})

noticeSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Notice = mongoose.model('Notice', noticeSchema)
module.exports = Notice
