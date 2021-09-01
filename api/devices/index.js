const { Schema } = require('mongoose')
const Devices = require('../../models/devices')
const Qsys = require('../../models/qsys')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      await barix.get(device.ipaddress)
    } else if (device.type === 'QSys') {
      try {
        pageStatusUpdate(device.ipaddress)
        // const address = ({ host: device.ipaddress, port: 1710 })
        // const r = await qsys.getStatus(address)        
        // console.log(r)
        // getNames = []
        // for (let i = 1; i <= 16; i++) {
        //   getNames[i -1] = 'zone.'+ i + '.gain'
        // }
        // console.log(getNames)
        // const r = await qsys.getComponentControls(
        //   address, 'PA',
        //   getNames
        // )
        // const rt = await Qsys.findOne({ ipaddress: device.ipaddress })
        // console.log(rt)
        // let tmp
        // if (!rt) {
        //   tmp = new Qsys({
        //     ipaddress: device.ipaddress
        //   })
        //   r.Controls.forEach(async (e, idx) => {
        //     tmp.zone.push({ idx: idx, gain: e.Value })
        //   })
        // }
        // tmp.save((err) => {
        //   console.log(err)
        // })
        // const rrr = rt.zone.id('612f33b8e4457022015f5d79')
        // console.log(rrr)
        // const rrrr = await Qsys.updateOne({ ipaddress: device.ipaddress, 'zone._id': '612f33b8e4457022015f5d79' },{
        //   $set: {
        //     'zone.$.mute': false
        //   }
        // }, { upsert: true })

        // const rrrr = await Qsys.find({ ipaddress: device.ipaddress, 'zone.mute': false })
        // console.log(rt.zone[0])
        // rt.zone[0].mute = true
        // rt.save()

        // console.log(rrrr)
        //   if (!rc) {
        //     const tmp = new Qsys({
        //       ipaddress: ipaddress,
        //       zone:[{ idx: idx, gain: e.Gain}]
        //     })
        //     await tmp.save(function(err) {
        //       console.log(err)
        //     })
        //   }
        // })
        // const rt = await qsys.componentGetControls(address, 'PA')
        // console.log(rt)
        // rt.Controls.forEach(e => {
        //   console.log(e.Name)
        // })
        // if (r) {
        //   const result = await Devices.updateOne({
        //     ipaddress: device.ipaddress
        //   }, {
        //     $set: {
        //       status: r.Status.Code === 0 ? true: false,
        //       info: r
        //     }
        //   })
        // } else {
        //   returnError(device.ipaddress)
        // }
      } catch (error) {
        returnError(device.ipaddress)
      }
    }
  })
}

async function returnError (ipaddress) {
  return await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
}
function pageCreate (ipaddress) {
  //
}

async function pageStatusUpdate (ipaddress) {
  const address = { host: ipaddress, port: 1710 }
  const qsysdevice = await Qsys.findOne({ ipaddress: ipaddress })
  let getControls = []
  if (qsysdevice) {
    const channels = qsysdevice.pagechannel
    for (let i = 0; i < channels; i++) {
      getControls.push( `zone.${i + 1}.active`)
      getControls.push( `zone.${i + 1}.gain`)
      getControls.push( `zone.${i + 1}.mute`)
      getControls.push( `zone.${i + 1}.name`)
      getControls.push( `zone.${i + 1}.priority`)
      getControls.push( `zone.${i + 1}.source`)
    }
    const fromQsys = await qsys.getComponentControls(address, 'PA', getControls)
    fromQsys.Controls.forEach(e => {
      const parse = e.Name.split('.')
      const idx = Number(parse[1]) - 1
      const key = parse[2]
      qsysdevice.zone[idx][key] = e.Value
    })
    qsysdevice.save((err) => {
      console.error(err)
    })
  }
}