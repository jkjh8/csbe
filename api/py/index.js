const { PythonShell } = require('python-shell')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

exports.preview = async (req, res) => {
  const text = req.body.text
  try {
    const options = {
      mode: 'text',
      pythonPath: '',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['make_file', text, path.join(tempPath, `${uuidv4()}.mp3`)]
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
      pythonPath: '',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['get_voices']
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) throw err
      const rtmsg = JSON.parse(result)
      console.log(rtmsg)
      res.status(200).json(rtmsg)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}