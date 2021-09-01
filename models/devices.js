const mongoose = require('mongoose')

const devicesSchema = new mongoose.Schema({
  index: { type: Number },
  name: { type: String },
  mac: { type: String, unique: true },
  ipaddress: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  mode: { type: String },
  alarm: { type: Boolean, default: false },
  controls : { type: Object },
  description: { type: String },
  auth: { type: Array },
  checked: { type: Boolean, default: false, required: true },
  status: { type: Boolean, default: false, required: true },
  // timestamp
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  failedAt: { type: Date }
})

devicesSchema.pre('updateOne', (next) => {
  this.updatedAt = Date.now()
  next()
})

const Device = mongoose.model('Device', devicesSchema)
module.exports = Device
