const mongoose = require('mongoose')

const zonesSchema = new mongoose.Schema({
  index: { type: Number, unique: true },
  name: { type: String, },
  mode: { type: String, default: 'Barix' },
  vol: { type: Number, },
  mute: { type: Boolean, },
  relay: { type: Boolean },
  location: { type: String },
  channel: { type: Number },
  status: { type: Boolean },
  mac: { type: String },
  info: { type: Object },
  // timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

zonesSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Zones = mongoose.model('Zones', zonesSchema)
module.exports = Zones

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Zones', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       unique: true
//     },
//     index: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       unique: true
//     },
//     name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     mode: {
//       type: DataTypes.STRING(16),
//       allowNull: false,
//       defaultValue: 'Barix'
//     },
//     vol: {
//       type: DataTypes.INTEGER,
//       allowNull: true
//     },
//     mute: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     relay: {
//       type: DataTypes.BOOLEAN
//     },
//     location: {
//       type: DataTypes.STRING
//     },
//     channel: {
//       type: DataTypes.INTEGER
//     },
//     status: {
//       type: DataTypes.BOOLEAN
//     },
//     mac: {
//       type: DataTypes.STRING
//     },
//     info: {
//       type: DataTypes.JSON
//     }
//   }, {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//     underscored: true
//   })
// }
