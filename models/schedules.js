/** @format */

const mongoose = require('mongoose')

const schedulesschema = new mongoose.Schema(
  {
    id: { type: String },
    repeat: { type: String },
    mode: { type: String },
    time: { type: String },
    date: { type: String },
    week: { type: Array },
    name: { type: String },
    ttsText: { type: String },
    ttsRate: { type: Number },
    ttsVoice: { type: Object },
    user_id: { type: String },
    start: { type: Date },
    file: { type: Object },
    volume: { type: Number },
    description: { type: String },
    scheduleFile: { type: Object },
    zones: { type: Array },
    selected: { type: Array },
  },
  {
    timestamps: true
  }
)

const Scehdules = mongoose.model('Scehdules', schedulesschema)
module.exports = Scehdules
