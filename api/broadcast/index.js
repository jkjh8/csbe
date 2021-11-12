const qsys = require('api/devices/qsys')

exports.onair = async (obj) => {
  try {
    app.broadcast = obj
    for (let i = 0; i < obj.nodes.length; i++) {
      console.log('start', obj.nodes[i])
      await qsys.onair(obj.nodes[i])
      await qsys.getPA(obj.nodes[i])
    }
    return
  } catch (err) {
    return console.error(err)
  }
}

exports.offair = async (arr) => {
  try {
    arr.nodes.forEach(obj => {
      qsys.offair(obj)
    })
  } catch (err) {
    return console.error(err)
  }
}

exports.cancel = async (obj) => {
  try {
    qsys.forceCancel(obj)
  } catch (err) {
    return console.error(err)
  }
}
