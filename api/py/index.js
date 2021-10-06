const { PythonShell } = require('python-shell')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const os = require('os')

exports.preview = async (req, res) => {
  const text = req.body.text
  try {
    const filename = uuidv4()
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['make_file', text, tempPath, filename]
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) console.error(err)
      res.status(200).json(result)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.getVoices = (req, res) => {
  try {
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['get_voices']
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) {
        console.error(err)
      }
      console.log(result)
      res.status(200).json(result)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}