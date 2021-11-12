const Schedules = require('models/schedules')
const moment = require('moment')
const broadcast = require('api/broadcast')
const fnDevices = require('api/devices')

const multicastAddress = '230.185.192.12'

let timer = null

exports.checkSchedule = async function () {
  const dateNow = moment()
  const weekday = dateNow.day()
  const date = dateNow.format('YYYY-MM-DD')
  const time = dateNow.format('hh:mm')

  console.log(weekday, date, time)
  const r = await Schedules.find({
    $or: [
      { $and:
        [
          { repeat: '매주' },
          { week: { $elemMatch: { value: weekday } } },
          { time: time },
          { active: true }
        ]
      },
      { $and:
        [
          { repeat: '매일' },
          { time: time },
          { active: true }
        ]
      },
      { $and:
        [
          { repeat: '한번' },
          { date: date },
          { time: time },
          { active: true }
        ]
      }
    ]
  })
  r.forEach(schedule => {
    console.log('schedule', schedule)
    broadcast.onair(schedule)
    const msg = new Buffer.from(JSON.stringify({
      playerId: 1,
      command: 'play',
      file: schedule.file,
      startChime: schedule.startChime,
      endChime: schedule.endChime,
      vol: schedule.vol
    }))
    app.server.send(msg, 12341, multicastAddress)

    if (!timer) {
      timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
      setTimeout(() => {
        clearInterval(timer)
        timer = null
      }, 5000)
    }
  })
    
}
