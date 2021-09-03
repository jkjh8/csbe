const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('../../../models/devices')
const Qsys = require('../../../models/qsys')

module.exports.getStatus = async function getStatus (obj) {
  let client = new QrcClient()
  client.socket.setTimeout(5000)
  client.socket.on('connect', async function () {
    const status = await client.send(commands.getStatus())
    client.end()
    await Qsys.updateOne({
      ipaddress: obj.ipaddress
    }, {
      $set: status
    })
  })
  client.on('error', function () {
    console.log(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`)
    client.socket.destroy()
    client.end()
  })
  client.on('timeout', function () {
    client.end()
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

// zones
module.exports.getZones = async function getZones (obj) {
  let client = new QrcClient()
  client.socket.setTimeout(5000)
  client.socket.on('connect', async function () {
    const zoneControls = getPAControlNames(obj.channels)
    const bgmControls = getPAControlBgmNames(obj.channels)
    const zone = await client.send(commands.getComponentControls('PA', zoneControls))
    const bgm = await client.send(commands.getComponentControls('PA', bgmControls))
    client.end()
    updateZones(zone, bgm, obj)
  })
  client.on('error', function (e) {
    console.log(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
    client.socket.destroy()
    client.end()
  })
  client.on('timeout', function () {
    client.end()
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

function updateZones (zone, bgm, obj) {
  Qsys.findOne({ ipaddress: obj.ipaddress }).then((docs) => {
    zone.Controls.forEach(e => {
      const name = e.Name.split('.')
      let idx = Number(name[1]) - 1
      const key = name[2] + (name[3] ? name[3]: '')
  
      for (let i = 0; i < obj.channels; i++) {
        if (i === idx) {
          if (key === 'name' || key === 'message') {
            docs.zone[idx][key] = e.String
            break
          }
          docs.zone[idx][key] = e.Value
          break
        }
      }
    })
    bgm.Controls.forEach(e => {
      const idx = Number(e.Name.replace(/[^0-9]/g, '')) - 1
      for (let i = 0; i < obj.channels; i++) {
        if (i === idx) {
          docs.zone[idx].bgmchannel = e.Value
        }
      }
    })
    docs.save()
  }).catch(err => {
    console.log('방송구간 업데이트 중 에러가 발생하였습니다.', err)
  })
}

// stations
module.exports.getStations = async function (obj) {
  let client = new QrcClient()
  client.socket.setTimeout(5000)
  client.socket.on('connect', async function () {
    const stations = []
    const controlNames = getStationControlNames(obj.channels)
    for (let i = 0; i < obj.stations; i++) {
      const r = await client.send(commands.getComponentControls(`Station${i + 1}`, controlNames))
      stations.push(r)
    }
    client.end()
    updateStations(stations, obj)
  })
  client.on('error', function (e) {
    console.log(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
    client.socket.destroy()
    client.end()
  })
  client.on('timeout', function () {
    client.end()
  })
  client.on('close', function () {
    console.log('close')
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

function updateStations (arr, obj) {
  Qsys.findOne({ ipaddress: obj.ipaddress }).then((docs) => {
    const select = []
    arr.forEach((station, idx) => {
      docs.stations[idx].stationId = idx + 1
      station.Controls.forEach(e => {
        const name = e.Name.replace(/\./gi, '')
        switch (name) {
          case 'mode':
          case 'statustext':
            docs.stations[idx][name] = e.String
            break
          case 'priority':
          case 'archive':
          case 'busy':
          case 'ready':
          case 'speaknow':
          case 'split':
          case 'stateraw':
            docs.stations[idx][name] = e.Value
            break
          default:
            select.push(e.Value)
        }
      docs.stations[idx].zoneselect = select
      })
    })
    docs.save()
  }).catch(err => {
    console.log('스테이션 정보 업데이트 중 오류가 발생하였습니다.', err)
  })
}

// default data
const rxControls = [
  'channel.1.gain',
  'channel.2.gain',
  'channel.1.muten',
  'channel.2.muten',
  'enable',
  'url',
  'interface',
  'channel.1.peaklevel',
  'channel.2.peaklevel',
  'netcache',
  'status',
  'status.led'
]

const txControls = [
  'channel.1.gain',
  'channel.2.gain',
  'channel.1.mute',
  'channel.2.mute',
  'datarate',
  'enable',
  'format',
  'host',
  'interface',
  'meter.1',
  'meter.2',
  'multicast.ttl',
  'port',
  'protocol',
  'status',
  'status.led',
  'svsi.address',
  'svsi.stream'
]

function getStationControlNames (channels) {
  const controlNames = [
    'mode','priority','archive','busy','ready','speak.now','split','state.raw','status.text'
  ]
  for (let i = 0; i < channels; i++) {
    controlNames.push(`zone.select.${i + 1}`)
  }
  return controlNames
}

function getPAControlNames (channels) {
  const controlNames = []
  for (let i = 0; i < channels; i++) {
    controlNames.push( `zone.${i + 1}.active`)
    controlNames.push( `zone.${i + 1}.gain`)
    controlNames.push( `zone.${i + 1}.mute`)
    controlNames.push( `zone.${i + 1}.name`)
    controlNames.push( `zone.${i + 1}.priority`)
    controlNames.push( `zone.${i + 1}.source`)
    controlNames.push( `zone.${i + 1}.message`)
    controlNames.push( `zone.${i + 1}.message.gain`)
    controlNames.push( `zone.${i + 1}.message.mute`)
    controlNames.push( `zone.${i + 1}.page.gain`)
    controlNames.push( `zone.${i + 1}.page.mute`)
    controlNames.push( `zone.${i + 1}.bgm.gain`)
  }
  return controlNames
}

function getPAControlBgmNames (channels) {
  const controlNames = []
  for (let i = 0; i < channels; i++) {
    controlNames.push( `bgm.router.select.${i + 1}`)
  }
  return controlNames
}

module.exports.addPA = function addPA (db, channels = 16) {
  try {
    for (let i = 0; i < channels; i++) {
      db.zone.push({
        channel: i + 1,
        active: false,
        gain: 0,
        mute: false,
        name: '0',
        priority: 0,
        source: 0,
        squelch: 0,
        squelchactive: false,
        bgmgain: 0,
        bgmchannel: 1,
        pagegain: 0,
        pagemute: false,
        messagegain: 0,
        messagemute: false
      })
    }
  } catch (err) {
    console.error('error initPa', err)
  }
}

module.exports.addStations = async function addStations (db, stations = 4) {
  try {
    for (let i = 0; i < stations; i++) {
      db.stations.push({
        stationId: (i + 1),
        mode: 'Live',
        archive: false,
        busy: false,
        ready: false,
        speaknow: false,
        split: false,
        stateraw: 0,
        statustext: '',
        zoneselect: []
      })
    }
  } catch (err) {
    console.error('error initStations', err)
  }
}

module.exports.addTx = async function addTx (db, channels = 4) {
  for (let i = 0; i < channels; i++) {
    db.tx.push({
      channel1gain: 0,
      channel2gain: 0,
      channel1mute: false,
      channel2mute: false,
      datarate: '',
      enable: false,
      format: '',
      host: '',
      interface: 'Auto',
      meter1: 0,
      meter2: 0,
      multicastttl: 0,
      port: 0,
      protocol: '',
      status: '',
      statusled: false,
      svsiaddress: '',
      svsistream: 0
    })
  }
}

module.exports.addRx = async function addRx (db, channels = 4) {
  for (let i = 0; i < channels; i++) {
    db.rx.push({
      channel1gain: 0,
      channel2gain: 0,
      channel1mute: false,
      channel2mute: false,
      enable: false,
      url: '',
      interface: 'Auto',
      channel1peaklevel: 0,
      channel2peaklevel: 0,
      netcache: 0,
      status: '',
      statusled: false
    })
  }
}

module.exports.removeQsysItems = async function removeQsysItems (db, name, channels) {
  const ref = db[name].length - channels
  for (let i = 0; i < ref; i++) {
    await db[name].id(db[name][db[name].length - 1]._id).remove()
  }
}
