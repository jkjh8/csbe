const mongoose = require('mongoose')

const ttsTextSchema = new mongoose.Schema({
  type: { type: String, default: 'global' },
  name: { type: String },
  user_id: { type: String },
  rate: { type: Number, default: 200 },
  voice: { type: Object },
  volume: { type: Number },
  text: { type: String }
}, {
  timestamps: true
})

const TtsText = mongoose.model('TtsText', ttsTextSchema)
module.exports = TtsText
