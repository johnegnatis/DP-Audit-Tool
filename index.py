import sys, io
# sys.stdout = io.StringIO() # to fix --no console, must be the first three lines, so we cannot use NO_CONSOLE flag
# sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654

## Determine which flags we are using and set variables accordingly
DEVELOPMENT = False
NO_CONSOLE = False
for i in sys.argv:
    if (i == '--noconsole'):
        NO_CONSOLE = True
    if (i == '--develop'):
        DEVELOPMENT = True    

import eel, os, scripts, server
from multiprocessing import Process, freeze_support

# Expose all eel functions to Javascript
@eel.expose
def getDataFromTranscript(filePath):
    return scripts.getDataFromTranscriptMethod(filePath)

@eel.expose
def makeDegreePlan(studentObject):
    return scripts.makeDegreePlanMethod(studentObject)

@eel.expose
def doAudit(studentObject):
    return scripts.doAuditMethod(studentObject)

@eel.expose
def getFilePaths():
    return scripts.getFilePathsMethod()

@eel.expose
def savePDF(fileName, signature, flatten):
    return scripts.savePDFMethod(fileName, signature, flatten)

@eel.expose
def designateClasses(studentObject):
    return scripts.designateClassesMethod(studentObject)

@eel.expose
def getFrontendOptions():
    return scripts.get_options_for_frontend()

EEL_PORT = 8888
@eel.expose
def getEelPort():
    return EEL_PORT

WEB_SERVER_PORT = 8000
@eel.expose
def getServerPort():
    return WEB_SERVER_PORT

@eel.expose
def getDirectory():
    return scripts.getDirectory()

@eel.expose
def settingAPI(action, payload):
    return scripts.settings(action, payload)

def run_eel():
    if (DEVELOPMENT):
        try:
            eel.init('src')
            eel.start({"port": 3000}, host="localhost", port=EEL_PORT, mode=None) # Remove mode=None to see the chrome app pop up.
        except Exception as e:
            print(e)
    else:
        eel.init('build')
        eel.start('index.html', host="localhost", port=EEL_PORT)

if __name__ == '__main__':
    freeze_support()  # for pyinstaller on Windows
    server = Process(target = server.host_server, args=[WEB_SERVER_PORT])
    server.start()
    run_eel()

