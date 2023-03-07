# coding: utf-8

import sys, io
# Uncomment for NO-CONSOLE
sys.stdout = io.StringIO() # to fix --no console
sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654

import eel, os
from scripts.getDataFromTranscript import getDataFromTranscriptMethod
from scripts.makeDegreePlan import makeDegreePlanMethod
from scripts.doAudit import doAuditMethod
from scripts.getFilePaths import getFilePathsMethod

@eel.expose
def getDataFromTranscript(filePath):
    return getDataFromTranscriptMethod(filePath)

@eel.expose
def MakeDegreePlan(studentObject):
    makeDegreePlanMethod(studentObject)

@eel.expose
def DoAudit(studentObject):
    doAuditMethod(studentObject)

@eel.expose
def getFilePaths():
    return getFilePathsMethod()

if __name__ == '__main__':
    if (len(sys.argv) > 1 and sys.argv[1] == '--develop'):
        eel.init('client')
        eel.start({"port": 3000}, host="localhost", port=8888, mode=None) # Remove mode=None to see the chrome app pop up.
    else:
        eel.init('build')
        eel.start('index.html', host="localhost", port=8888)


