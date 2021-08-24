const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const logsSchema = new mongoose.Schema({
  source: { type: String, requird: true },
  category: { type: String, required: true, default: 'info' }, //warning, error
  priority: { type: String, required: true, default: 'low' }, //mid, high
  zones: { type: Array },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
})
// logsSchema.index({ '$**': 'text' })
logsSchema.plugin(mongoosePaginate)

const Logs = mongoose.model('Logs', logsSchema)
module.exports = Logs


// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Logs', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       unique: true
//     },
//     source: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     category: {
//       type: DataTypes.STRING(16),
//       defaultValue: 'info'
//     },
//     priority: {
//       type: DataTypes.STRING(16),
//       defaultValue: 'row'
//     },
//     zones: {
//       type: DataTypes.STRING(512)
//     },
//     message: {
//       type: DataTypes.STRING(512)
//     }
//   }, {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//     underscored: true
//   })
// }