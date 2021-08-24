// const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
// mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  userName: { type: String },
  nickname: { type: String },
  profileImage: { type: String},
  email: { type: String },
  password: { type: String, bcrypt: true },
  admin: { type: Boolean, default: false },
  tts: { type: Boolean, default: false },
  auth: { type: Array },
  userLevel: { type: Number, default: 0 },
  numberOfLogin: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  loginAt: { type: Date }
})

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

userSchema.plugin(require('mongoose-bcrypt')), { rounds: 10 }
const User = mongoose.model('User', userSchema)

module.exports = User

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('Users', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       unique: true
//     },
//     user_id: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//       unique: true
//     },
//     user_name: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     nick_name: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     profile_image: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     email: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     password: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     user_level: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0
//     },
//     admin: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     auth: {
//       type: DataTypes.JSON
//     },
//     tts: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     number_of_login: {
//       type: DataTypes.BIGINT,
//       defaultValue: 0
//     },
//     loginAt: {
//       type: DataTypes.DATE
//     }
//   }, {
//     charset: 'utf8',
//     collate: 'utf8_unicode_ci',
//     underscored: true
//   })
// }
