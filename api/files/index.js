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
    const folder = path.join(filesPath, req.body.join('/'))
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
      const dir = path.join(target.fsrc)
      if (fs.existsSync(target.fsrc)) {
        fs.rmdirSync(target.fsrc)
        return res.status(200).json({ dir: target.name, message: '폴더가 삭제 되었습니다'})
      }
      return res.status(500).json({ dir: target.name, message: '폴더가 존재 하지 않습니다'})
    } else {
      if (fs.existsSync(target.fsrc)) {
        fs.unlinkSync(target.fsrc)
        return res.status(200).json({ file: target.name, message: '파일이 삭제 되었습니다'})
      }
      return res.status(500).json({ file: target.name, message: '파일이 존재하지 안습니다.'})
    }
  } catch (err) {
    res.status(500).json({ err, message: '서버 에러가 발생하였습니다' })
  }
}

exports.getFilesInPath = async (req, res) => {
  try {
    const rt = []
    const reqPath = path.join(filesPath, req.body.path.join('/'))
    console.log(reqPath)
    const files = await fs.readdirSync(reqPath, { withFileTypes: true })
    for (let i = 0; i < files.length; i++) {
       if (files[i].isDirectory()) {
         rt.push({
           idx: i,
           dir: true,
           base: 'media',
           type: 'directory',
           name: files[i].name,
           src: req.body.path.join('/'),
           fsrc: path.join(reqPath, files[i].name)
         })
       }
    }
    for (let i = 0; i < files.length; i++) {
      if (new RegExp(/.wav|.mp3/g).test(files[i].name)) {
        // let fileInfo = {}
        // fileInfo = await getFileInfo(f[i].name, reqPath)
        // fileInfo['idx'] = i
        // fileInfo['base'] = 'media'
        // fileInfo['src'] = req.query.link
        // fileInfo['dir'] = false
        // fileInfo['name'] = f[i].name
        // fileInfo['type'] = 'audio'
        // fileInfo['fsrc'] = reqPath
        rt.push({
          idx: i,
          dir: false,
          base: 'media',
          type: 'audio',
          name: files[i].name,
          src: req.body.path.join('/'),
          fsrc: path.join(reqPath, files[i].name),
          size: fs.statSync(path.join(reqPath, files[i].name)).size
        })
      } else if (new RegExp(/.mp4|.mkv|.mov/g).test(files[i].name)) {
        // let fileInfo = {}
        // fileInfo = await getFileInfo(f[i].name, reqPath)
        // fileInfo['idx'] = i
        // fileInfo['base'] = 'media'
        // fileInfo['src'] = req.query.link
        // fileInfo['dir'] = false
        // fileInfo['name'] = f[i].name
        // fileInfo['type'] = 'video'
        // fileInfo['fsrc'] = reqPath
        // files.push(fileInfo)
        rt.push({
          idx: i,
          dir: false,
          base: 'media',
          type: 'video',
          name: files[i].name,
          src: req.body.path.join('/'),
          fsrc: path.join(reqPath, files[i].name),
          size: fs.statSync(path.join(reqPath, files[i].name)).size
        })

    }
    }
    res.status(200).json({
      path: removeBlank(reqPath.replace(filesPath, '').split(path.sep)),
      files: rt
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err, message: '서버 에러가 발생하였습니다.'})
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
    path: removeBlank(reqPath.replace(filesPath, 'Home').split(path.sep)),
    files: files.sort(function (a) {
      if (a.dir === true ) return -1
      return 0
    })
  })
}

function removeBlank (item) {
  for (let i = 0; i < item.length; i++) {
    if(item[i] === '') {
      item.splice(i, 1);
      i--
    }
  }
  return item
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
