/** @format */

const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
  {
    mode: { type: String },
    name: { type: String },
    user_id: { type: String },
    start: { type: Date },
    file: { type: String },
    volume: { type: Number },
    description: { type: String }
  },
  {
    timestamps: true
  }
)

const Reservations = mongoose.model('Reservations', reservationSchema)
module.exports = Reservations
