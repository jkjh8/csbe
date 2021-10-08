const { PythonShell } = require('python-shell')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const os = require('os')

exports.preview = async (req, res) => {
  const text = req.body.text
  const voiceId = req.body.voice.id
  const rate = req.body.rate
  try {
    const filename = `${uuidv4()}`
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['make_file', text, tempPath, filename, rate, voiceId]
    }
    PythonShell.run('tts.py', options, function(err, result) {
      if (err) console.error(err)
      res.status(200).json(result[0])
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.getVoices = (req, res) => {
  try {
    let result = {}
    let options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['get_voices']
    }
    PythonShell.run('tts.py', options, function(err, rt) {
      if (err) {
        console.error(err)
      }
      result['voices'] = rt[0]

      options = {
        mode: 'json',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: __dirname,
        args: ['get_rate']
      }
      PythonShell.run('tts.py', options, function(err, rt) {
        if (err) {
          console.error(err)
        }
        result['rate'] = rt[0].rate
        console.log(result)
        res.status(200).json(result)
      })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}