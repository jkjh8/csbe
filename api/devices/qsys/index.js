const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('models/devices')
const clients = {}
const status = {}

async function connect (obj) {
  const client = new QrcClient()
  client.on('connect', async () => {
    clients[obj.ipaddress] = client
    const r = await Devices.updateOne({ _id: obj._id }, { $set: { status: true } })
    console.log('connected device', r, obj.ipaddress)
  })
  // client.socket.on('data', (rt) => {
  //   let data = rt.toString()
  //   if (data.includes('PA.PageStatus')) {
  //     const returnData = JSON.parse(data.substring(0, data.length - 1))
  //     console.log(returnData)
  //     status[obj.ipaddress] = returnData
  //     app.io.emit('onair', returnData)
  //   }
  // })
  client.on('error', async (e) => {
    clients[obj.ipaddress] = null
    const r = await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
    console.log('disconnect device on error', r, obj.ipaddress)
  })
  client.socket.on('timeout', async () => {
    clients[obj.ipaddress] = null
    const r = await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
    console.log('disconnect timeout device', r, obj.ipaddress)
  })
  client.connect({ host: obj.ipaddress, port: 1710 })
}

module.exports.updateDevice = async function (obj) {
  try {
    if (obj.status && clients[obj.ipaddress]) {
      await updateZones(clients[obj.ipaddress], obj)
    } else {
      await connect(obj)
    }
  } catch (err) {
    console.error(err)
    const r = await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { connect: false } })
  }
}

module.exports.onair = async function (obj) {
  console.log(obj)
  const params = { 
    Zones: obj.channels, 
    Description: obj.name,
    MaxPageTime: 0,
    Mode: 'live',
    Station: 1,
    Priority: 3,
    Start: true
  }
  let timer
  if (!clients[obj.ipaddress]) {
    console.log('connect', obj.ipaddress)
    await connect(obj)
    setTimeout(async () => {
      if (clients[obj.ipaddress]) {
        console.log('client ok')
        clearInterval(timer)
        const r = await clients[obj.ipaddress].send({ id: 1, method: 'PA.PageSubmit', params: params })
        await updateZones(clients[obj.ipaddress], obj)
      }
    }, 1000)
  } else {
    const r = await clients[obj.ipaddress].send({ id: 1, method: 'PA.PageSubmit', params: params })
    await updateZones(clients[obj.ipaddress], obj)
  }

  // if (r && r.PageID) {
  //   pageIds[obj.ipaddress] = Number(r.PageID)
  //   const rt = await client.send({ id: 4549, method: 'PA.PageStart', params: { PageID: r.PageID} })
  //   // await client.send({ id: 1, method: 'PA.PageStop', params: r })
  //   console.log(rt)
  // } else {
  //   return null
  // }
}

module.exports.offair = async function (obj) {
  try {
    if (clients[obj.ipaddress]) {
      // const paStatus = status[obj.ipaddress]
      // console.log('status', paStatus)
      const client = clients[obj.ipaddress]
      // const r = await client.send({ id: paStatus.params.PageID, method: 'PA.PageStop', params: { PageID: paStatus.params.PageID } })
      const r = await client.send(commands.setComponentControls('PA', [{
        Name: 'cancel.all.commands',
        Value: 1
      }]))
      console.log(r)
      
    }
  } catch (err) {
    console.error(err)
  }
}

async function updateZones (client, obj) {
  const zones = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
  const status = await client.send(commands.getStatus())

  const gain = []
  const mute = []
  const active = []
  zones.Controls.forEach(e => {
    if (e.Name.match(/zone.\d+.gain/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      gain[channel - 1] = e.Value
    }
    if (e.Name.match(/zone.\d+.mute/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      mute[channel - 1] = e.Value
    }
    if (e.Name.match(/zone.\d+.active/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      active[channel - 1] = e.Value
    }
  })
  const result = await Devices.updateOne({
    ipaddress: obj.ipaddress
  }, {
    $set: {
      gain, mute, active,
      detail: status,
      status: true
    } 
  })
  return result
}

const onError = (e, obj, client) => {
  if (client) {
    client.end()
  }
  console.error(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
  Devices.updateMany({ ipaddress: obj.ipaddress }, { $set: { status: false } }).exec()
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

const setTxAddress = async (ipaddress, channel, value) => {
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
  client.on('error', (e) => onError(e, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: ipaddress, port: 1710 })
}
module.exports.setTxAddress = setTxAddress

module.exports.qsysTxDub = async (info) => {
  const qsys = await Qsys.find().select({ ipaddress: 1, tx: 1 })
  for (let i = 0; i < qsys.length; i++) {
    for (let j = 0; j < qsys[i].tx.length; j++) {
      for (let n = 0; n < qsys[i].tx[j].length; n++) {
        if (qsys[i].tx[j][n].Name === 'host') {
          if (qsys[i].tx[j][n].String === info.device.ipaddress) {
            if (info.device.ipaddress === qsys[i].ipaddress && info.channel === (j + 1)) {
              console.log('pass')
            } else {
              console.log(`ipaddress=${qsys[i].ipaddress}, channel=${j+1}`)
              await setTxAddress(qsys[i].ipaddress,  j + 1, ' ')
            }
          }
        }
      }
    }
  }
}

module.exports.qsysTxClear = async (info) => {
  console.log(info)
}
