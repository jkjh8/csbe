const axios = require('axios')
const cheerio = require('cheerio')
const Devices = require('../../../models/devices')



async function http (address) {
  try {
    const html = await axios.get(`http://${address}/status`)
    const $ = cheerio.load(html.data)
    const r = { hardware: {}, status: {}, network: {}, audio: {}, streaming: {}, io: {}, serial: {} }
    $('dd').each(function (idx, ele) {
      if ($(this).find('#hardware').attr('class')) {
        return r.hardware[$(this).find('#hardware').attr('class')] = $(this).find('#hardware').text().trim()
      }  
      else if ($(this).find('#status').attr('class')) {
        return r.status[$(this).find('#status').attr('class')] = $(this).find('#status').text().trim()
      }
      else if ($(this).find('#network').attr('class')) {
        return r.network[$(this).find('#network').attr('class')] = $(this).find('#network').text().trim()
      }
      else if ($(this).find('#audio').attr('class')) {
        return r.audio[$(this).find('#audio').attr('class')] = $(this).find('#audio').text().trim()
      }
      else if ($(this).find('#streaming').attr('class')) {
        return r.streaming[$(this).find('#streaming').attr('class')] = $(this).find('#streaming').text().trim()
      }
      else if ($(this).find('#io').attr('class')) {
        return r.io[$(this).find('#io').attr('class')] = $(this).find('#io').text().trim()
      }
      else if ($(this).find('#serial').attr('class')) {
        return r.serial[$(this).find('#serial').attr('class')] = $(this).find('#serial').text().trim()
      }
    })
    return r
  } catch (error) {
    return null
  }
}
module.exports.http = http
module.exports.get = (ipaddress) => {
  try {
    const deviceInfo = await http(ipaddress)
    if (deviceInfo) {
      await Devices.updateOne({
        ipaddress: ipaddress
      }, {
        $set: { status: true, info: r }
      })
    } else {
      await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
    }
  } catch (err) {
    await Devices.updateOne({ ipaddress: ipaddress }, { $set: { status: false } })
  }
}