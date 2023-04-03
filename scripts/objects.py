from json import JSONEncoder, dumps, loads

class StudentEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class Student:
    def __init__(self, name, studentId, fastTrack, thesis, admitted_date, expected_graduation, classes, track='unsure'):
        self.name = name
        self.studentId = studentId
        self.options = { 'fastTrack': fastTrack, 'thesis': thesis }
        self.dates = { 'admitted': admitted_date, 'expected_graduation': expected_graduation }
        self.classes = classes # list class object below
        self.track = track

    def packStudentObject(self):
        return dumps(self, cls=StudentEncoder, indent=2)

    def unpackStudentObject(self):
        return loads(self)

transferOptions = {
    'fast_track': 'fastTrack',
    'transfer': 'transfer',
    '': '',
}

typeOptions = {
     '': 'unsure',
     'unsure': 'unsure',
     'core': 'core',
     'one_of_the_following': 'one_of_the_following',
     'core_electives': 'core_electives',
     'additional_electives': 'additional_electives',
     'prerequisites': 'prerequisites',
    }

class Class:
    def __init__(self, name, number, semester, transfer, grade, attempted_credits, type = 'unsure'):
        self.name = name
        self.number = number
        self.semester = semester
        self.transfer = transferOptions[transfer]
        self.grade = grade
        self.attempted_credits = attempted_credits
        self.type = typeOptions[type]

def mockStudent():
    classes = [
        Class('Statistical Methods for Data Sciences', 'CS 6313', '22S', '', 'A', '', 'core'),
        Class('Big Data Management and Analytics', 'CS 6350', '22s', '', 'B+', '', 'core'),
        Class('Design and Analysis of Computer Algorithms', 'CS 6363','22s', '', 'A-', '', 'core'),
        Class('Machine Learning', 'CS 6375',  '21f', '', 'A', '', 'core'),
        Class('Social Network Analytics', 'CS 6301',  '22f', '', '', '', 'one_of_the_following'),
        Class('Natural Language Processing', 'CS 6320',   '21f', '', '', '', 'one_of_the_following'),
        Class('Video Analytics', 'CS 6327',   '', '', '', '', 'one_of_the_following'),
        Class('Statistics for Machine Learning', 'CS 6347',   '', '', '', '', 'one_of_the_following'),
        Class('Database Design', 'CS 6360',   '', '', 'A-', '', 'one_of_the_following'),
        Class('Virtual Reality', 'CS 6334',   '', '', 'B', '', 'core_electives'),
        Class('Theory of Computation', 'CS 6382', '21f', '', 'A', '', 'core_electives'),
        Class('Natural Language Processing', 'CS 6320',   '22s', '', 'A', '', 'core_electives'),
        Class('Network Security', 'CS 6349',  '22f', '', '', '', 'core_electives'),
        Class('Sftwr Test/Validatn/Verificatn', 'CS 6367','22f', '', '', '', 'core_electives'),
        Class('Software Maint Evolut & Re-Eng', 'SE 6356','23s', '', '', '', 'core_electives'),
        Class('Computer Science I', 'CS 5303','23s', '', '', '', 'additional_electives'),
        Class('Computer Science II', 'CS 5330',   '23s', '', '', '', 'prerequisites'),
        Class('Discrete Structures', 'CS 5333',   '', '', '', '', 'prerequisites'),
        Class('Algorithm Analysis & Data Structures', 'CS 5343',  '', '', '', '', 'prerequisites'),
        Class('Operating System Concepts', 'CS 5348', '', '', '', '', 'prerequisites'),
        Class('Probability & Statistics in CS<<', 'CS 3341<<','', '', '*** A- ***', '', 'prerequisites'),
    ]
    return Student('Lasso, Ted', 2021504218, False, False, '21F', '', classes, 'Data Science')

def getMockStudent():
    return mockStudent().packStudentObject()

if __name__ == '__main__':
    print(getMockStudent())