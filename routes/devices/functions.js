const Devices = require('models/devices')
const Qsys = require('models/qsys')
const qsys = require('api/devices/qsys')

module.exports.check = async (obj) => {
  try {
    // let r = await Devices.findOne({ index: obj.index })
    // if (r && r._id.toString() !== obj._id) return '인덱스가 중복되었습니다.'
    // r = await Devices.findOne({ ipaddress: obj.ipaddress })
    // if (r && r._id.toString() !== obj._id) return '아이피가 이미 존재 합니다.'
    // if (obj.mac) {
    //   r = await Devices.findOne({ mac: obj.mac })
    //   if (r && r._id.toString() !== obj._id) return '맥어드레스가 이미 존재 합니다.'
    // }
    return null
  } catch (err) {
    console.error('디바이스 중복체크중 에러', err)
    return '알 수 없는 오류가 발생했습니다.'
  }
}

// module.exports.createQsys = async (obj) => {
//   try {
//     const newQsys = new Qsys({
//       ipaddress: obj.ipaddress
//     })
//     qsys.addPA(newQsys, obj.channels)
//     qsys.addStations(newQsys, obj.stations)
//     qsys.addTx(newQsys, obj.tx)
//     qsys.addRx(newQsys, obj.rx)
//     const r = await newQsys.save()
//     console.log('qsys 데이터 생성완료', r)
//     return null
//   } catch (err) {
//     console.error('qsys 데이터 생성중 에러', err)
//     return '디바이스를 생성 할 수 없습니다.'
//   }
// }


// module.exports.compaireQsys = async (obj) => {
//   try {
//     let r
//     // zones
//     const current = await Qsys.findOne({ ipaddress: obj.ipaddress })
//     if (obj.channels < current.zone.length) {
//       r = await qsys.removeQsysItems(current, 'zone', obj.channels)
//       console.log('지역삭제', r)
//     } else if (obj.channels > current.zone.length) {
//       r = await qsys.addPA(current, obj.channels - current.zone.length)
//       console.log('지역추가', r)
//     }
//     // stations
//     if (obj.stations < current.stations.length) {
//       r = await qsys.removeQsysItems(current, 'stations', obj.stations)
//       console.log('스테이션 삭제', r)
//     } else if (obj.stations > current.stations.length) {
//       r = await qsys.addStations(current, obj.stations - current.stations.length)
//       console.log('스테이션 추가', r)
//     }
//     // tx
//     if (obj.tx < current.tx.length) {
//       r = await qsys.removeQsysItems(current, 'tx', obj.tx)
//       console.log('트랜스미터 삭제', r)
//     } else if (obj.tx > current.tx.length) {
//       r = await qsys.addTx(current, obj.tx - current.tx.length)
//       console.log('트랜스미터 추가', r)
//     }
//     // rx
//     if (obj.rx < current.rx.length) {
//       r = await qsys.removeQsysItems(current, 'rx', obj.rx)
//       console.log('트랜스미터 삭제', r)
//     } else if (obj.rx > current.rx.length) {
//       r = await qsys.addRx(current, obj.rx - current.rx.length)
//       console.log('트랜스미터 추가', r)
//     }
//     // 저장
//     r = await current.save()
//     console.log('qsys 데이터 수정 완료')
//     return null
//   } catch (err) {
//     console.error('qsys 데이터 수정중 에러', err)
//     return '디바이스 데이터를 수정할 수 없습니다.'
//   }
// }
