const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  channel: { type: Number },
  active: { type: Boolean },
  gain: { type: Number },
  name: { type: String },
  mute: { type: Boolean },
  pagegain: { type: Number },
  pagemute: { type: Boolean },
  message: { type: String },
  messagegain: { type: Number },
  messagemute: { type: Boolean },
  priority: { type: Number },
  source: { type: Number },
  squelch: { type:Number },
  squelchactive : { type: Boolean },
  bgmgain: { type: Number },
  bgmchannel: { type: Number }
})

const txSchema = new mongoose.Schema({
  channel1gain: { type: Number },
  channel2gain: { type: Number },
  channel1mute: { type: Boolean },
  channel2mute: { type: Boolean },
  datarate: { type: String },
  enable: { type: Boolean },
  format: { type: String },
  host: { type: String },
  interface: { type: String, default: 'Auto' },
  meter1: { type: Number },
  meter2: { type: Number },
  multicastttl: { type: Number },
  port: { type: Number },
  protocol: { type: String },
  status: { type: String },
  statusled: { type: Boolean },
  svsiaddress: { type: String },
  svsistream: { type: Number }
})

const rxSchema = new mongoose.Schema({
  channel1gain: { type: Number },
  channel2gain: { type: Number },
  channel1mute: { type: Boolean },
  channel2mute: { type: Boolean },
  enable: { type: Boolean },
  url: { type: String },
  interface: { type: String, default: 'Auto' },
  channel1peaklevel: { type: Number },
  channel2peaklevel: { type: Number },
  netcache: { type: Number },
  status: { type: String },
  statusled: { type: Boolean }
})

const stationSchema = new mongoose.Schema({
  stationId: { type: Number },
  mode: { type: String },
  priority: { type: Number },
  archive: { type: Boolean },
  busy: { type: Boolean},
  ready: { type: Boolean },
  speaknow: { type: Boolean },
  split: { type: Boolean },
  stateraw: { type: Number },
  statustext: { type: String },
  zoneselect: { type: Array }
})

const qsysSchema = new mongoose.Schema({
  ipaddress: { type: String, unique: true, required: true },
  channels: { type: Number, default: 16 },
  bgmchannel: { type: Number, default: 4 },
  stations: { type: Number, default: 4 },
  Platform: { type: String },
  State: { type: String },
  DesignName: { type: String },
  DesignCode: { type: String },
  IsRedundant: { type: Boolean },
  IsEmulator: { type: Boolean },
  Status: { type: Object },
  zone:[pageSchema],
  stations: [stationSchema],
  tx:[txSchema],
  rx:[rxSchema],
  failedAt: { type: Date }
}, {
  timestamps: true
})

// const QsysPage = mongoose.model('QsysPage', pageSchema)
const Qsys = mongoose.model('Qsys', qsysSchema)
module.exports = Qsys
