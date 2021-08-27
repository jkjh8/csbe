const axios = require('axios')
const cheerio = require('cheerio')

const getHtml = async () => {
  try {
    return await axios.get('http://192.168.1.46/status')
  } catch (error) {
    console.error(error)
  }
}
getHtml().then(html => {
  hardware = new Object()
  status = new Object()
  const $ = cheerio.load(html.data)
  $('dd').each(function(index, ele) {
    if ($(this).find('#hardware').attr('class')) {
      hardware[$(this).find('#hardware').attr('class')] = $(this).find('#hardware').text().trim()
    }
    if ($(this).find('#status').attr('class')) {
      status[$(this).find('#status').attr('class')] = $(this).find('#status').text().trim()
    }
  })
  

  $('dd').each(function(index, ele) {
    
    
  })
  const r = {
    hardware: hardware,
    status: status
  }
  console.log(r)
  // console.log($bodyList.length)
  // console.log($bodyList.html())
  
  // const info = $bodyList.children('#hardware')
  // console.log(info.length, info.text())
  // for(let i = 0; 0 < info.length; i++) {
  //   console.log((info).eq(i))
  // }
})
