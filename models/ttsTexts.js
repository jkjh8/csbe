const mongoose = require('mongoose')

const ttsTextSchema = new mongoose.Schema({
  type: { type: String, default: 'Private' },
  name: { type: String },
  user_id: { type: String },
  rate: { type: Number, default: 200 },
  voice: { type: Object },
  volume: { type: Number },
  text: { type: String }
}, {
  timestamps: true
})

const TtsTexts = mongoose.model('TtsTexts', ttsTextSchema)
module.exports = TtsTexts
