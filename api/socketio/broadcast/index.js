const qsys = require('api/devices/qsys')

exports.onair = async (arr) => {
  console.log(arr)
  for (let i = 0; i < arr.channels.length; i++) {
    console.log('start')
    await qsys.onair({
      ...arr.channels[i],
      name: arr.name
    })
    await qsys.getPA(arr.channels[i])
  }
  return
}

exports.offair = async (arr) => {
  arr.channels.forEach(obj => {
    qsys.offair(obj)
  })
}