const path = require('path')
const fs = require('fs')
/* global filesPath */

// load ffmpeg
// const ffmpegPath = require('ffmpeg-static')
// const ffprobePath = require('ffprobe-static')
// ffmpeg = require('fluent-ffmpeg')
// ffmpeg.setFfmpegPath('')
// ffmpeg.setFfprobePath('')

exports.makeFolder = async (req, res) => {
  try {
    let reqPath = req.body.currentPath
    reqPath.shift()
    reqPath = reqPath.join('/')
    const folder = path.join(filesPath, reqPath, req.body.folder)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
      return res.status(200).json({ dir: folder, message: '폴더를 생성하였습니다' })
    } else {
      return res.status(500).json({ message: '폴더가 이미 존재합니다'})
    }
  } catch (error) {
    res.status(500).json({ error, message: '폴더생성시 문제가 발생하였습니다' })
  }
}

exports.upload = async (req, res) => {
  let file
  let uploadPath

  console.log(req.body)

  if(!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('업로드 할 파일이 없습니다.')
  }
  file = req.files.files

  uploadPath = path.join(filesPath, req.body.path, file.name)

  file.mv(uploadPath, function(err) {
    if(err) return res.status(500).send('업로드 중 에러가 발생하였습니다.')
    res.status(200).send('업로드 완료')
  })
}

exports.del = async (req, res) => {
  try {
    const target = req.body
    if (target.type === 'directory') {
      const dir = path.join(target.fsrc, target.name)
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir)
        return res.status(200).json({ dir: dir, message: '폴더가 삭제 되었습니다'})
      }
      return res.status(500).json({ dir: dir, message: '폴더가 존재 하지 않습니다'})
    } else {
      const file = target.filename
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
        return res.status(200).json({ file: file, message: '파일이 삭제 되었습니다'})
      }
      return res.status(500).json({ file: file, message: '파일이 존재하지 안습니다.'})
    }
  } catch (err) {
    res.status(500).json({ err, message: '서버 에러가 발생하였습니다' })
  }
}

exports.getFiles = async (req, res) => {
  const reqPath = path.join(filesPath, req.query.link)
  const files = []
  const f = await fs.readdirSync(reqPath, { withFileTypes: true })
  for (let i = 0; i < f.length; i++) {
    if (f[i].isDirectory()) {
      files.push({
        idx: i,
        dir: true,
        base: 'media',
        type: 'directory',
        name: f[i].name,
        fsrc: reqPath
      })
    } else if (new RegExp(/.wav|.mp3/g).test(f[i].name)) {
      let fileInfo = {}
      // fileInfo = await getFileInfo(f[i].name, reqPath)
      fileInfo['idx'] = i
      fileInfo['base'] = 'media'
      fileInfo['src'] = req.query.link
      fileInfo['dir'] = false
      fileInfo['name'] = f[i].name
      fileInfo['type'] = 'audio'
      fileInfo['fsrc'] = reqPath
      files.push(fileInfo)
    } else if (new RegExp(/.mp4|.mkv|.mov/g).test(f[i].name)) {
      let fileInfo = {}
      // fileInfo = await getFileInfo(f[i].name, reqPath)
      fileInfo['idx'] = i
      fileInfo['base'] = 'media'
      fileInfo['src'] = req.query.link
      fileInfo['dir'] = false
      fileInfo['name'] = f[i].name
      fileInfo['type'] = 'video'
      fileInfo['fsrc'] = reqPath
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

exports.removeTmpFiles = function (req, res) {
  const files = fs.readdirSync(tempPath)
  console.log(files)
  files.forEach(f => {
    const file = path.join(tempPath, f)
    fs.stat(file, ((err, stats) => {
      if (err) {
        console.error('delete error', file)
      }
      if (!stats.isDirectory()) {
        return fs.unlinkSync(file)
      }
    }))
  })
  res.sendStatus(200)
}
