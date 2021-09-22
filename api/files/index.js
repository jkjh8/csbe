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
  const f = await fs.readdirSync(filesPath)
  f.forEach(file => {
    console.log(file)
    const filePath = path.join(filesPath, file)
    console.log(filePath)
    new ffmpeg(path.join(filesPath, file)).ffprobe(function(err, video) {
      console.log(err)
      console.log(video.format)
    })
  })
  res.status(200).json(f)
}