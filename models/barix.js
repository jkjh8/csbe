const mongoose = require('mongoose')

const barixSchema = new mongoose.Schema({
  index: { type: Number },
  name: { type: String },
  mac: { type: String, unique: true, requird: true },
  alarm: { type: Boolean, default: false },
  info: { type: Object },
  // additional info
  description: { type: String },
  checked: { type: Boolean, default: false, requird: true },
  status: { type: Boolean, default: false, requird: true },
  // timestamp
  createdAt: { type: Date, default: Date.now, requird: true },
  updatedAt: { type: Date, default: Date.now, requird: true }
})

const Barix = mongoose.model('Barix', barixSchema)
module.exports = Barix

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Barix', {
//     //id
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//       unique: true
//     },
//     index: {
//       type: DataTypes.INTEGER,
//       unique: true
//     },
//     name: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     // device info
//     mac: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true
//     },
//     alarm: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     buffer: {
//       type: DataTypes.INTEGER
//     },
//     latency: {
//       type: DataTypes.INTEGER
//     },
//     frameloss: {
//       type: DataTypes.INTEGER
//     },
//     framedup: {
//       type: DataTypes.INTEGER
//     },
//     framedrop: {
//       type: DataTypes.INTEGER
//     },
//     softerrorcount: {
//       type: DataTypes.INTEGER
//     },
//     streamnumber: {
//       type: DataTypes.INTEGER
//     },
//     bitrate: {
//       type: DataTypes.INTEGER
//     },
//     reconnects: {
//       type: DataTypes.INTEGER
//     },
//     error: {
//       type: DataTypes.INTEGER
//     },
//     volume: {
//       type: DataTypes.INTEGER
//     },
//     uptime: {
//       type: DataTypes.BIGINT
//     },
//     ipaddress: {
//       type: DataTypes.STRING
//     },
//     streamurl: {
//       type: DataTypes.STRING
//     },
//     // additional info
//     description: {
//       type: DataTypes.STRING
//     },
//     checked: {
//       type: DataTypes.BOOLEAN,
//       default: false
//     },
//     status: {
//       type: DataTypes.BOOLEAN,
//       default: false
//     }
//   }, {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//     underscored: true
//   })
// }