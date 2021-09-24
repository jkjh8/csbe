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
  console.log(req.query.link)
  const reqPath = path.join(filesPath, req.query.link)
  const files = []
  const f = await fs.readdirSync(reqPath, { withFileTypes: true })
  for (let i = 0; i < f.length; i++) {
    if (f[i].isDirectory()) {
      files.push({
        idx: i,
        dir: true,
        type: 'directory',
        name: f[i].name
      })
    } else if (new RegExp(/wav|mp3/g).test(f[i].name)) {
      const fileInfo = await getFileInfo(f[i].name, reqPath)
      fileInfo['idx'] = i
      fileInfo['dir'] = false
      fileInfo['name'] = f[i].name
      fileInfo['type'] = 'audio'
      files.push(fileInfo)
    }
  }
  res.status(200).json({
    path: reqPath.replace(filesPath, 'Home').split(path.sep),
    files: files.sort(function (a) {
      if (a.dir === true ) return -1
      return 0
    })
  })
}

function getFileInfo (file, reqPath) {
  console.log(reqPath)
  return new Promise ((resolve, reject) => {
    new ffmpeg(path.join(reqPath, file)).ffprobe((err, media) => {
      if (err) throw err
      resolve(media.format)
    })
  })
}