const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  userId: { type: String },
  from: { type: String },
  type: { type: String },
  message: { type: String },
  link: { type: String },
  user_level: { type: Number, default: 0 },
  checked: { type: Boolean, default: false },
  // timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Data, default: Date.now }
})

noticeSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Notice = mongoose.model('Notice', noticeSchema)
module.exports = Notice

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Notice', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       unique: true
//     },
//     user_id: {
//       type: DataTypes.STRING(128),
//       allowNull: true,
//     },
//     from: {
//       type: DataTypes.STRING(128),
//       allowNull: true
//     },
//     type: {
//       type: DataTypes.STRING(40),
//       allowNull: true
//     },
//     message: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     link: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     user_level: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0
//     },
//     checked: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   })
// }
