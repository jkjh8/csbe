const path = require('path')
const fs = require('fs')
/* global filesPath */

// load ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

exports.getFiles = async (req, res) => {
  const files = []
  const f = await fs.readdirSync(filesPath, { withFileTypes: true })
  for (let i = 0; i < f.length; i++) {
    if (f[i].isDirectory()) {
      files.push({
        dir: true,
        name: f[i].name
      })
    } else {
      const fileInfo = await getFileInfo(f[i].name) 
      fileInfo['name'] = f[i].name
      fileInfo['dir'] = false
      files.push(fileInfo)
    }
  }
  res.status(200).json(files)
}

function getFileInfo (file) {
  return new Promise ((resolve, reject) => {
    new ffmpeg(path.join(filesPath, file)).ffprobe((err, media) => {
      if (err) throw err
      resolve(media.format)
    })
  })
}