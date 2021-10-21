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
  loginAt: { type: Date },
  color: { type: String, default: '##91ECEC' }
}, {
  timestamps: true
})

userSchema.plugin(require('mongoose-bcrypt')), { rounds: 10 }
const User = mongoose.model('User', userSchema)

module.exports = User
