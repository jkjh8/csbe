const mongoose = require('mongoose')

const zonePresetSchema = new mongoose.Schema({
  type: { type: String, default: 'global' },
  name: { type: String },
  user_id: { type: String },
  zones_id: { type: Array },
  zones: { type: Array }
}, {
  timestamps: true
})

const ZonePreset = mongoose.model('ZonePreset', zonePresetSchema)
module.exports = ZonePreset
