const Barix = require('../../models/barix')
const moment = require('moment')

setInterval(async () => {
  console.log('check barix !!!')
  const r = await Barix.find()
  const currentTime = moment()
  r.forEach(e => {
    const duration = moment.duration(currentTime.diff(moment(e.updatedAt))).asMinutes()
    if (duration > 5 && e.status) {
      console.log(duration, e.status, "1")
      Barix.updateOne({ _id: e._id }, { $set: { status: false } }, { upsert: true }, function() {
        console.log('update status', e.mac)
      }) 
    } else if (duration < 5 && !e.status ) {
      console.log(duration, e.status, "2")
      Barix.updateOne({ _id: e._id }, { $set: { status: true } }, { upsert: true }, function () {
        console.log('update status!', e.mac)
      })
    }
  })
}, 6000)
