const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Qsys = require('../../../models/qsys')
const Devices = require('../../../models/devices')

module.exports.createQsys = async (obj) => {
  const client = new QrcClient()
  client.socket.on('connect', async () => {
    await checkRxTx(client, obj)
    await updateStatus(client, obj)
    await createZones(client, obj)
    await updateRx(client, obj)
    await updateTx(client, obj)
    client.end()
  })
  client.on('error', (e) => onError(e, obj, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: obj.ipaddress, port: 1710 })
}

module.exports.updateZones = async (obj) => {
  const client = new QrcClient()
  client.setTimeout(5000)
  client.on('connect', async () => {
    checkRxTx(client, obj)
    client.end()
  })
  client.on('error', (e) => onError(e, obj, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: obj.ipaddress, port: 1710 })
}

async function checkRxTx(client, obj) {
  try {
    const device = await Devices.findOne({ ipaddress: obj.ipaddress })
    const controls = await client.send(commands.getComponents())
    const stations = []
    const rx = []
    const tx = []
    controls.forEach(e => {
      if (e.Name.match(/RX\d+/)) {
        rx.push(e)
      }
      if (e.Name.match(/TX\d+/)) {
        tx.push(e)
      }
      if (e.Name.match(/Station\d+/)) {
        stations.push(e)
      }
    })
    device.tx = tx.length
    device.rx = rx.length
    device.stations = stations.length
    await device.save()
  } catch (err) {
    console.error(err)
  }
}

async function updateStatus(client, obj) {
  try {
    const status = await client.send(commands.getStatus())
    const r = await await Qsys.updateOne({
      ipaddress: obj.ipaddress
      }, {
        $set: status
      }, {
        upsert: true
      })
  } catch (err) {
    console.error(err)
  }
}

async function createZones (client, obj) {
  try {
    const qsys = await Qsys.findOne({ ipaddress: obj.ipaddress })
    if (qsys) {
      const zones = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
      qsys.zone = []
      const channels = []
      zones.Controls.forEach(e => {
        qsys.zone.push(e)
        if (e.Name.match(/zone.\d+.gain/)) {
          channels.push(e)
        }
      })
      await qsys.save()
      // check channel
      await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { channels: channels.length } })
    } else {
      console.log(`${obj.ipaddress} 디바이스를 찾을 수 없습니다.`)
    }
  } catch (err) {
    console.error('Create Zones Error', err)
  }
}

async function updateRx (client, obj) {
  try {
    const device = await Devices.findOne({ ipaddress: obj.ipaddress })
    const qsys = await Qsys.findOne({ ipaddress: obj.ipaddress })
    qsys.rx = []

    for (let i = 0; i < device.rx; i++) {
      const r = await client.send({ method: 'Component.GetControls', params: { Name: `RX${i + 1}` } })
      qsys.rx.push(r.Controls)
    }
    qsys.save()
  } catch (err) {
    console.error('err')
  }
}

async function updateTx (client, obj) {
  try {
    const device = await Devices.findOne({ ipaddress: obj.ipaddress })
    const qsys = await Qsys.findOne({ ipaddress: obj.ipaddress })
    qsys.tx = []

    for (let i = 0; i < device.tx; i++) {
      const r = await client.send({ method: 'Component.GetControls', params: { Name: `TX${i + 1}` } })
      qsys.tx.push(r.Controls)
    }
    qsys.save()
  } catch (err) {
    console.error('err')
  }
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
  await device.save()
  return result
}

const onError = (e, obj, client) => {
  if (client) {
    client.end()
  }
  console.error(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
  Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } }).exec()
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

module.exports.setTxAddress = async (ipaddress, channel, value) => {
  const client = new QrcClient()
  client.socket.on('connect', async () => {
    const txSocket = [
      { Name: 'host', Value: value },
      { Name: 'port', Value: 3030 }
    ]
    const rt = await client.send(commands.setComponentControls(`TX${channel}`, txSocket))
    client.end()
    console.log(rt)
    return rt
  })
  client.on('error', (e) => onError(e, obj, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: ipaddress, port: 1710 })
}