import sys
import pyttsx3
import json

def make_file(command):    
    engine = pyttsx3.init()
    text = command[2]
    filename = command[3]
    engine.setProperty('rate', 160)
# engine.say(text)
# engine.runAndWait()
# voices = engine.getProperty("voice")[0]
# engine.setProperty('voice', voices)

    engine.save_to_file(text, filename)
    engine.runAndWait()
    print(json.dumps({"file": filename, "text": text }))

def get_voices():
    engine = pyttsx3.init()
    voices = engine.getProperty("voice")
    print(json.dumps(voices))

if __name__ == "__main__":
    command = sys.argv
    if command[1] == "make_file":
        make_file(command)
    elif command[1] == "get_voices":
        get_voices()
