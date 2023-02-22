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

options = {
        'required': 'required',
        'core': 'core',
        'elective': 'elective',
        'prerequisite': 'prerequisite',
    }

class Class:
    def __init__(self, type, name, semester, grade):
        self.type = options[type]
        self.name = name
        self.semester = semester
        self.grade = grade