const { PythonShell } = require('python-shell')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const os = require('os')

let pythonPath = ''
if (os.type === 'darwin') {
  pythonPath = './opt/homebrew/Cellar/python@3.9/3.9.7/libexec/bin/python3'
}

exports.preview = async (req, res) => {
  const text = req.body.text
  try {
    const filename = uuidv4()
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['make_file', text, tempPath, filename]
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) throw err
      const rtmsg = JSON.parse(result)
      console.log(rtmsg)
      res.status(200).json(rtmsg)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.getVoices = (req, res) => {
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['get_voices']
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) {
        console.error(err)
      }
      const rtmsg = JSON.parse(result)
      console.log(rtmsg)
      res.status(200).json(rtmsg)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}