import json
from json import JSONEncoder

class StudentEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class Student:
    def __init__(self, name, studentId, fastTrack, thesis, admitted_date, expected_graduation, classes):
        self.name = name
        self.studentId = studentId
        self.options = { 'fastTrack': fastTrack, 'thesis': thesis }
        self.dates = { 'admitted': admitted_date, 'expected_graduation': expected_graduation }
        self.classes = classes # list class object below

    def packStudentObject(self):
        return json.dumps(self, cls=StudentEncoder)

    def unpackStudentObject(self):
        return json.loads(self)

transferOptions = {
    'fast_track': 'fastTrack',
    'transfer': 'transfer',
    '': '',
}

class Class:
    def __init__(self, name, number, semester, transfer, grade, attempted_credits):
        self.name = name
        self.number = number
        self.semester = semester
        self.transfer = transferOptions[transfer]
        self.grade = grade
        self.attempted_credits = attempted_credits