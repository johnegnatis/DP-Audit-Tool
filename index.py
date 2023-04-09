import sys, io

## Determine which flags we are using and set variables accordingly
DEVELOPMENT = False
NO_CONSOLE = False
for i in sys.argv:
    if (i == '--noconsole'):
        NO_CONSOLE = True
    if (i == '--develop'):
        DEVELOPMENT = True
if not DEVELOPMENT and NO_CONSOLE:
    sys.stdout = io.StringIO() # to fix --no console
    sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654

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
def DoAudit(studentObject):
    scripts.doAuditMethod(studentObject)

@eel.expose
def getFilePaths():
    return scripts.getFilePathsMethod()

@eel.expose
def savePDF(fileName):
    return scripts.savePDFMethod(fileName)

@eel.expose
def designateClasses(studentObject):
    return scripts.designateClassesMethod(studentObject)

if NO_CONSOLE and getattr(sys, 'frozen', False):
    import pyi_splash

EEL_PORT = 8888
WEB_SERVER_PORT = 8000

def run_eel():
    if (DEVELOPMENT):
        try:
            eel.init('client')
            eel.start({"port": 3000}, host="localhost", port=EEL_PORT, mode=None) # Remove mode=None to see the chrome app pop up.
        except Exception as e:
            print(e)
    else:
        eel.init('build')
        if NO_CONSOLE and getattr(sys, 'frozen', False):
            pyi_splash.close()
        eel.start('index.html', host="localhost", port=EEL_PORT)

if __name__ == '__main__':
    freeze_support()  # for pyinstaller on Windows
    server = Process(target = server.host_server, args=[WEB_SERVER_PORT])
    server.start()
    run_eel()

