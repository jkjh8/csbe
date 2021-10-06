import sys
import pyttsx3
import subprocess
import json

def make_file(command):
    try:
        engine = pyttsx3.init()
        text = command[2]
        filePath = command[3]
        filename = command[4]
        engine.setProperty('rate', 160)
        fileWav = filePath + '/' + filename + '.wav'
        fileMp3 = filePath + '/' + filename + '.mp3'
        # engine.say(text)
        # engine.runAndWait()
        # voices = engine.getProperty("voice")[0]
        # engine.setProperty('voice', voices)

        engine.save_to_file(text, filePath + '/' + filename + '.wav')
        engine.runAndWait()
        subprocess.call(["ffmpeg", "-y", "-i", fileWav, fileMp3])
        print(json.dumps({"file": fileMp3, "text": text, "src": filename+'.mp3', "base": "temp"}))
    except Exception:
        print(json.dumps({ 'error': Exception }))

def get_voices():
    try:    
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        print(json.dumps(voices, default=lambda x: x.__dict__))
    except Exception:
        print(json.dumps({ "error": Exception }))

def get_rate():
    try:
        engine = pyttsx3.init()
        rate = engine.getProperty('rate')
        print(json.dumps({ "rate": rate }))
    except Exception:
        print(json.dumps({ "error": Exception }))

if __name__ == "__main__":
    command = sys.argv
    if command[1] == "make_file":
        make_file(command)
    elif command[1] == "get_voices":
        get_voices()
    elif command[1] == "get_rate":
        get_rate()
