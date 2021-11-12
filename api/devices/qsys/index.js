const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const net = require('net')

const Devices = require('models/devices')
const clients = {}
const pageId = {}

async function closeSocket (obj) {
  // clients[obj.ipaddress].destroy()
  clients[obj.ipaddress] = null
  await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
  console.log('socket client disconnect - ', obj.ipaddress)
  // setTimeout(async () => { await connect(obj) }, 5000)
}

async function connect (obj) {
  let buffer = ''
  const client = net.connect({ port: 1710, host: obj.ipaddress }, () => {
    console.log('connected ', obj.ipaddress)
  })

  client.on('data', async (data) => {
    try {
      if (data[data.length - 1] === 0x00) {
        data = data.toString('utf8')
        buffer += data
        await parse(JSON.parse(buffer.substring(0, buffer.length - 1)), obj)
        buffer = ''
      } else {
        data = data.toString('utf8')
        buffer += data
      }
    } catch (err) {
      buffer = ''
      console.error(err)
    }
  })

  client.on('connect', async () => {
    buffer = ''
    clients[obj.ipaddress] = client
    await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: true } })
  })

  client.on('close', async () => { await closeSocket(obj) })
  client.on('timeout', async () => { await closeSocket(obj) })
  client.on('error', async () => { await closeSocket(obj) })
}

// parse
async function parse (obj, device) {
  if (obj.id) {
    if (obj.id.indexOf('getpa') > -1) {
      await updatePA(obj)
    } else if (obj.id.indexOf('offair') > -1) {
      await updateOffair(obj)
    } else if (obj.id.indexOf('onair') > -1) {
      await updateOnair(obj)
    } else if (obj.id.indexOf('cancel') > -1) {
      await updatePaCancel(obj)
    } else if (obj.id.indexOf('force') > -1) {
      await console.log(obj)
    } else if (obj.id.indexOf('status') > -1) {
      await updateStatus(obj)
    }
  } else {
    switch (obj.method) {
      default:
        //console.log('return no id - ', obj)
        if (obj.method === 'PA.PageStatus') {
          app.io.emit('broadcast', obj)
        }
    }
  }
}

// commands
async function getStatus (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj)}
    let command = JSON.stringify({
      jsonrpc: '2.0',
      method: 'StatusGet',
      id: `status,${obj.ipaddress}`,
      params: 0
    })
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
    await Devices.updateOne({ ipaddres: obj.ipaddress }, { $set: { status: false } })
  }
}

module.exports.getStatus = async function (obj) {
  await getStatus(obj)
}

module.exports.getPA = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    let command = JSON.stringify({
      jsonrpc: '2.0',
      id: `getpa,${obj.ipaddress}`,
      method: 'Component.GetControls',
      params: { Name: 'PA' }
    })
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
    const r = await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
  }
}

module.exports.onair = async function (obj) {
  console.log(obj)
  if (!clients[obj.ipaddress]) { await connect(obj) }
  let command = JSON.stringify({
    jsonrpc: '2.0',
    id: `onair,${obj.ipaddress}`,
    method: 'PA.PageSubmit',
    params: {
      Zones: obj.channels, 
      Description: obj.name,
      MaxPageTime: 0,
      Mode: 'live',
      Station: 1,
      Priority: 3,
      Start: true
    }
  })
  clients[obj.ipaddress].write(command + '\0')
}

module.exports.offair = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    let command
    if (pageId[obj.ipaddress]) {
      command = JSON.stringify({
        jsonrpc: '2.0',
        id: `offair,${obj.ipaddress}`,
        method: 'PA.PageStop',
        params: { PageID: pageId[obj.ipaddress] }
      })
    } else {
      command = JSON.stringify({
        jsonrpc: '2.0',
        id: `force,${obj.ipaddress}`,
        method: 'Component.Set',
        params: {
          Name: 'PA',
          Controls: [
            {
              Name: 'cancel.all.commands',
              Value: 1
            }
          ]
        }
      })
    }
    console.log('offair', command)
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
  }
}

module.exports.cancel = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    const command = JSON.stringify({
      jsonrpc: '2.0',
      id: `cancel,${obj.ipaddress}`,
      method: 'PA.PageCancel',
      params: { PageID: pageId[obj.ipaddress] }
    })
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
  }
}

module.exports.forceCancel = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    const command = JSON.stringify({
      jsonrpc: '2.0',
      id: `force,${obj.ipaddress}`,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [
          {
            Name: 'cancel.all.commands',
            Value: 1
          }
        ]
      }
    })
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
  }
}

module.exports.changeVol = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    const command = JSON.stringify({
      jsonrpc: '2.0',
      id: `setvol,${obj.ipaddress}`,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [
          {
            Name: `zone.${obj.channel}.gain`,
            Value: obj.vol
          }
        ]
      }
    })
    console.log(command)
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
  }
}

module.exports.changeMute = async function (obj) {
  try {
    if (!clients[obj.ipaddress]) { await connect(obj) }
    const command = JSON.stringify({
      jsonrpc: '2.0',
      id: `setvol,${obj.ipaddress}`,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [
          {
            Name: `zone.${obj.channel}.mute`,
            Value: obj.mute
          }
        ]
      }
    })
    console.log(command)
    clients[obj.ipaddress].write(command + '\0')
  } catch (err) {
    console.error(err)
  }
}

// returns
async function updateStatus(obj) {
  try {
    const id = obj.id.split(',')
    const status = obj.result
    await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { detail: status } })
  } catch (err) {
    console.error(err)
  }

}
function updateOnair(obj) {
  const id = obj.id.split(',')
  if (obj && obj.result.PageID) {
    pageId[id[1]] = obj.result.PageID
    console.log('update page id - ', id[1])
  }
}

function updateOffair(obj) {
  console.log(obj)
}

function updatePaCancel(obj) {
  console.log(obj)
}

async function updatePA (obj) {
  const zones = obj.result
  const id = obj.id.split(',')
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
    ipaddress: id[1]
  }, {
    $set: {
      gain, mute, active,
      status: true
    } 
  })
  return result
}













// const setTxAddress = async (ipaddress, channel, value) => {
//   const client = new QrcClient()
//   client.socket.on('connect', async () => {
//     const txSocket = [
//       { Name: 'host', Value: value },
//       { Name: 'port', Value: 3030 }
//     ]
//     const rt = await client.send(commands.setComponentControls(`TX${channel}`, txSocket))
//     client.end()
//     console.log(rt)
//     return rt
//   })
//   client.on('error', (e) => onError(e, client))
//   client.socket.on('timeout', () => client.end())
//   client.connect({ host: ipaddress, port: 1710 })
// }
// module.exports.setTxAddress = setTxAddress

// module.exports.qsysTxDub = async (info) => {
//   const qsys = await Qsys.find().select({ ipaddress: 1, tx: 1 })
//   for (let i = 0; i < qsys.length; i++) {
//     for (let j = 0; j < qsys[i].tx.length; j++) {
//       for (let n = 0; n < qsys[i].tx[j].length; n++) {
//         if (qsys[i].tx[j][n].Name === 'host') {
//           if (qsys[i].tx[j][n].String === info.device.ipaddress) {
//             if (info.device.ipaddress === qsys[i].ipaddress && info.channel === (j + 1)) {
//               console.log('pass')
//             } else {
//               console.log(`ipaddress=${qsys[i].ipaddress}, channel=${j+1}`)
//               await setTxAddress(qsys[i].ipaddress,  j + 1, ' ')
//             }
//           }
//         }
//       }
//     }
//   }
// }

// module.exports.qsysTxClear = async (info) => {
//   console.log(info)
// }
