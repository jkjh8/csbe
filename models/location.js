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
  info: {  type: Object },
  // timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

locationSchema.pre('updateOne', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Locations = mongoose.model('Locations', locationSchema)
module.exports = Locations

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Locations', {
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
//     type: {
//       type: DataTypes.STRING
//     },
//     ip: {
//       type: DataTypes.STRING
//     },
//     port: {
//       type: DataTypes.BIGINT
//     },
//     status: {
//       type: DataTypes.BOOLEAN
//     },
//     mode: {
//       type: DataTypes.STRING
//     },
//     parent: {
//       type: DataTypes.STRING
//     },
//     channel: {
//       type: DataTypes.INTEGER
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