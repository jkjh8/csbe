/** @format */

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const Schedules = require('models/schedules')
const moment = require('moment')
moment.locale('KR')
// const Devices = require('models/devices')

function makeFolder(dir) {
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

async function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  try {
    return await new Promise(function(resolve, reject) {
      rd.on('error', reject);
      wr.on('error', reject);
      wr.on('finish', resolve);
      rd.pipe(wr);
    });
  } catch (error) {
    rd.destroy();
    wr.end();
    throw error;
  }
}

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query
    const query = []
    if (start && start !== 'undefined' && end && end !== 'undefined') {
      query.push({ dateData: {'$gte': start, '$lt' : end }})
      query.push({ repeat: '매일' })
      query.push({ repeat: '매주' })
    }
    let r
    if (query.length) {
      r = await Schedules.find({ $or: query }) 
    } else {
      r = await Schedules.find()
    }
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '서버 에러가 발생하였습니다.'})
  }
})

router.post('/', async (req, res) => {
  try {
    const reqSchedule = req.body

    // fileCopy
    const scheduleFolder = path.join(schedulePath, reqSchedule.id)
    const scheduleFile = path.join(scheduleFolder, reqSchedule.file.name)
    await makeFolder(scheduleFolder)
    await copyFile(path.join(reqSchedule.file.fsrc), scheduleFile)
    // console.log(movefile)

    const schedule = new Schedules({
      ...reqSchedule,
      scheduleFile: scheduleFile,
    })
    const r = await schedule.save()
    console.log(r)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '서버 에러가 발생하였습니다.'})
  }
})

router.put('/', async (req, res) => {
  try {
    const schedule = req.body
    console.log(schedule)
    const r = await Schedules.updateOne({ _id: schedule._id }, { $set: schedule })
    console.log(r)
    res.status(200).json(r)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: '서버 에러가 발생하였습니다.' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { _id, id } = req.body
    const scheduleFolder = path.join(schedulePath, id)
    rimraf.sync(scheduleFolder)
    const r = await Schedules.deleteOne({ _id: _id })
    res.status(200).json(r)
    
  } catch (err) {
    res.status(500).json({error: err, message: '서버 에러가 발생하였습니다.'})
  }

})

router.get('/active', async (req, res) => {
  try {
    const { id, value } = req.query
    const r = await Schedules.updateOne({ _id: id }, { $set: { active: value }})
    res.status(200).json(r)
  } catch (err) {
    res.status(500).json({error: err, message: '서버 에러가 발생하였습니다.'})
  }
})

// router.get('/', async (req, res) => {
//   try {
//     const r = await Locations.aggregate([
//       { $addFields: { location_id: { $toString: '$_id' } } },
//       { $lookup: { from: 'devices', localField: 'location_id', foreignField: 'location_id', as: 'device' } },
//       { $addFields: { device: { $arrayElemAt: ['$device', 0] } } }
//     ])
//     res.status(200).json(r)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: err })
//   }
// })

// router.get('/', async (req, res) => {
//   try {
//     const r = await Locations.aggregate([
//       { $addFields: { location_id: { $toString: '$_id' } } },
//       { $lookup: { from: 'devices', localField: 'location_id', foreignField: 'parent_id', as: 'children' } },
//       { $lookup: { from: 'devices', localField: 'ipaddress', foreignField: 'location_id', as: 'device' } },
//       { $addFields: { device: { $arrayElemAt: ['$device', 0] } } }
//     ])
//     res.status(200).json(r)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: err })
//   }
// })

// async function check (info) {
//   let r = await Locations.findOne({ index: info.index })
//   if (r && r._id.toString() !== info._id) return '인덱스가 중복 되었습니다.'
//   r = await Locations.findOne({ name: info.name })
//   if (r && r._id.toString() !== info._id) return '지역 이름이 이미 존재합니다.'
//   r = await Locations.findOne({ ipaddress: info.ipaddress })
//   if (r && r._id.toString() !== info._id) return '디바이스가 중복 선택되었습니다.'
// return null
// }

// router.post('/', async (req, res) => {
//   try {
//     const info = req.body
//     const checkDup = await check(info)
//     if (checkDup) return res.status(500).json({ message: checkDup })
//     const c = new Locations(info)
//     r = await c.save()
//     res.status(200).json(r)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
//   }
// })

// router.put('/', async (req, res) => {
//   try {
//     const info = req.body
//     const checkDup = await check(info)
//     if (checkDup) return res.status(500).json({ message: checkDup })

//     r = await Devices.updateOne({
//       ipaddress: info.ipaddress
//     }, { $set: { parent_id: info._id } })
//     console.log(r)
//     r = await Locations.updateOne({ _id: req.body._id }, { $set: req.body } )
//     res.status(200).json(r)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.' })
//   }
// })

// router.get('/delete', async (req, res) => {
//   const { _id } = req.query
//   try {
//     let r = await Locations.deleteOne({ _id: _id })
//     res.status(200).json(r)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: err, message: '알 수 없는 오류가 발생하였습니다.'})
//   }
// })

module.exports = router
