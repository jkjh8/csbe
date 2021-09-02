const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  index: { type: Number, unique: true },
  name: { type: String },
  type: { type: Number },
  ip: { type: String },
  port: { type: Number },
  status: { type: Boolean },
  mode: { type: String },
  parent: { type: String },
  channel: { type: Number },
  info: {  type: Object }
}, {
  timestamps: true
})

locationSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Locations = mongoose.model('Locations', locationSchema)
module.exports = Locations
