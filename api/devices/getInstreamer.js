const axios = require('axios')
const cheerio = require('cheerio')

const getHtml = async () => {
  try {
    return await axios.get('http://192.168.1.46/refresh')
  } catch (error) {
    console.error(error)
  }
}
getHtml().then(html => {
  console.log(html.data)
})

// getHtml().then(html => {
//   console.log(html.data)
//   const $ = cheerio.load(html.data)
//   const $bodyList = $('font > dl > dd')
//   console.log($($bodyList).text())
// })


