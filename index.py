import sys, io

# redirects python script output for build version
DEVELOPMENT = len(sys.argv) > 1 and sys.argv[1] == '--develop'
# if (DEVELOPMENT == False):
    # sys.stdout = io.StringIO() # to fix --no console
    # sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654

import eel, os, scripts, server
from multiprocessing import Process, freeze_support

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
def getPDF():
    return scripts.getPDFMethod()

if getattr(sys, 'frozen', False):
    import pyi_splash

# if __name__ == '__main__':
def run_eel():
    if (DEVELOPMENT):
        try:
            eel.init('client')
            eel.start({"port": 3000}, host="localhost", port=8888, mode=None) # Remove mode=None to see the chrome app pop up.
        except Exception as e:
            print(e)
    else:
        eel.init('build')
        if getattr(sys, 'frozen', False):
            pyi_splash.close()
        eel.start('index.html', host="localhost", port=8888)

if __name__ == '__main__':
    freeze_support()  # for pyinstaller on Windows
    server = Process(target = server.host_server, args=[8000])
    server.start()
    # eel = Process(target = run_eel)
    # eel.start()
    run_eel()

