const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Qsys = require('../../../models/qsys')

module.exports.createQsys = async (obj) => {
  const client = new QrcClient()
  client.socket.setTimeout(5000)
  client.socket.on('connect', async () => {
    const status = await client.send(commands.getStatus())
    const zones = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
    client.end()
    const qsys = new Qsys({
      ipaddress: obj.ipaddress,
      ...status
    })
    zones.Controls.forEach(e => {
      qsys.zone.push(e)
    })
    await qsys.save()
  })
  client.on('error', () => onError(obj, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: obj.ipaddress, port: 1710 })
}

const onError = (obj, client) => {
  console.errror(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`)
  client.end()
}

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
  const client = new QrcClient()
  client.socket.on('connect', async function () {
    const zone = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
    client.end()
    console.log(zone.Controls)
    const device = await Qsys.findOne({ ipaddress: obj.ipaddress })
    device.zone = []
    zone.Controls.forEach(e => {
      device.zone.push(e)
    })
    device.save()
  })
  client.on('error', function (e) {
    console.log(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
    client.end()
  })
  client.on('timeout', function () {
    client.end()
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

module.exports.updateZones = async (obj) => {
  const client = new QrcClient()
  client.socket.on('connect', async function () {
    const zone = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
    client.end()
    updateZones(zone.Controls, obj)
  })
  client.on('error', function (e) {
    console.log(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
    client.end()
  })
  client.on('timeout', function () {
    client.end()
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

async function updateZones (arr, obj) {
  const device = await Qsys.findOne({ ipaddress: obj.ipaddress })
  const active = []
  arr.forEach(e => {
    for (let i = 0; i < device.zone.length; i++) {
      if (e.Name === device.zone[i].Name) {
        device.zone[i] = e
        break
      }
    }
  })
  //check active
  device.zone.forEach(e => {
    if (e.Name.match(/zone.\d+.active/)) {
      active.push(e)
    }
  })
  const result = active.some(e => e.Value === true)
  device.active = result
  console.log(active, result)
  device.save()
}

module.exports.checkActive = async function checkActive(obj) {
  const device = await Qsys.findOne({ ipaddress: obj.ipaddress })
  const active = []
  device.zone.forEach(e => {
    if (e.Name.match(/zone.\d+.active/)) {
      active.push(e)
    }
  })
  const result = active.some(e => e.Value === 1)// or true
  device.active = result
  device.save()
  return result
}