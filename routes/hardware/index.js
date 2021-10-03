const express = require('express')
const router = express.Router()
const disk = require('diskusage')
const os = require('os')


router.get('/', async (req, res) => {
  try {
    let path = os.platform() === 'win32' ? 'c:':'/'

    const { available, free, total } = await disk.check(path)

    res.status(200).json({
      hostname: os.hostname(),
      type: os.type(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: os.uptime(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      nic: os.networkInterfaces(),
      freedisk: free,
      availabledis: available,
      totaldisk: total
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

module.exports = router
