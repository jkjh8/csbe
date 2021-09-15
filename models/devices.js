const mongoose = require('mongoose')

const devicesSchema = new mongoose.Schema({
  index: { type: Number },
  parent_id: { type: String, default: '' },
  name: { type: String },
  ipaddress: { type: String, required: true},
  type: { type: String, required: true },
  detail: { type: Object, default: {}, required: true },
  mode: { type: String },
  channels: { type: Number },
  gain: { type: Array },
  mute: { type: Array },
  active: { type: Array },
  detect: { type: Array },
  auth: { type: Array },
  checked: { type: Boolean, default: false, required: true },
  status: { type: Boolean, default: false, required: true },
  // timestamp
  failedAt: { type: Date }
}, { timestamps: true })

const Device = mongoose.model('Device', devicesSchema)
module.exports = Device
