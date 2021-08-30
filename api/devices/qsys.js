const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('../../models/devices')

const connect = (address) => {
  const client = new QrcClient()
  client.socket.setTimeout(5000)
  client.on('connect', function () {
    console.log('qsys connect')
  })
  client.on('finish', function () {
    console.log('qsys finish ', address)
  })
  client.on('error', async function (e) {
    console.log('qsys error ', address, e)
    try {
      await Devices.updateOne({
        ipaddress: address.host
      }, {
        $set: {
          status: false
        }
      })
    } catch (err) {
      console.log(err)
    }
  })
  client.on('timeout', function () {
    console.error('q-sys connet timeout', address)
    client.end()
  })
  return client.connect(address)
}

const logon = async (client, username, password) => {
  return await client.send(commands.logon(username, password))
}

module.exports.getStatus = async (address) => {
  try {
    const client = await connect(address)
    // const user = await logon(client, 'admin', 'password')
    const status = await client.send(commands.getStatus())
    client.end()
    return status
  } catch (err) {
    return null
  }
}

module.exports.getNamedControls = async (address, controlNames) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getNamedControls(controlNames))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.setNamedControl = async (address, controlName, spec) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.setNamedControl(controlName, spec))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.getComponents = async (address) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getComponents())
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.getComponentControls = async (address, componentName, controlNames) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getComponentControls(componentName, controlNames))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.setComponentControls = async (address, componentName, controls) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.setComponentControls(componentName, controls))
    client.end()
    return result
  } catch (error) {
    return null
  }
}
