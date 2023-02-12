# coding: utf-8
import sys, io
sys.stdout = io.StringIO() # to fix --no console
sys.stderr = io.StringIO() # https://github.com/python-eel/Eel/issues/654

import eel
from scripts.getDataFromTranscript import getDataFromTranscriptMethod
from scripts.makeDegreePlan import makeDegreePlanMethod
from scripts.doAudit import doAuditMethod

@eel.expose
def getDataFromTranscript(pdfData):
    return getDataFromTranscriptMethod(pdfData)

@eel.expose
def MakeDegreePlan(studentObject):
    makeDegreePlanMethod(studentObject)

@eel.expose
def DoAudit(studentObject):
    doAuditMethod(studentObject)


if __name__ == '__main__':
    try:
        if sys.argv[1] == '--develop':  # TODO: I dont understand Python,  how can we make it so this does not go out of range w.o a try: block
            eel.init('client')
            eel.start({"port": 3000}, host="localhost", port=8888)
        else:
            eel.init('build')
            eel.start('index.html', host="localhost", port=8888)
    except IndexError:
        eel.init('build')
        eel.start('index.html', host="localhost", port=8888)
