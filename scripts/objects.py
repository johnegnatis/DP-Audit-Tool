from json import JSONEncoder, dumps, loads

class StudentEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class Student:
    def __init__(self, name, studentId, fastTrack, thesis, admitted_date, expected_graduation, classes, track='', pdfName=''):
        self.name = name
        self.studentId = studentId
        self.options = { 'fastTrack': fastTrack, 'thesis': thesis }
        self.dates = { 'admitted': admitted_date, 'expected_graduation': expected_graduation }
        self.classes = classes # list class object below
        self.track = track
        self.pdfName = pdfName

    def packStudentObject(self):
        return dumps(self, cls=StudentEncoder, indent=2)

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

def mockStudent(unsure = False):
    if (unsure == True):
        classes = [
            Class('Statistical Methods for Data Sciences', 'CS 6313', '22S', '', 'A', '', 'unsure'),
            Class('Big Data Management and Analytics', 'CS 6350', '22s', '', 'B+', '', 'unsure'),
            Class('Design and Analysis of Computer Algorithms', 'CS 6363','22s', '', 'A-', '', 'unsure'),
            Class('Machine Learning', 'CS 6375',  '21f', '', 'A', '', 'unsure'),
            Class('Social Network Analytics', 'CS 6301',  '22f', '', '', '', 'unsure'),
            Class('Natural Language Processing', 'CS 6320',   '21f', '', '', '', 'unsure'),
            Class('Video Analytics', 'CS 6327',   '', '', '', '', 'unsure'),
            Class('Statistics for Machine Learning', 'CS 6347',   '', '', '', '', 'unsure'),
            Class('Database Design', 'CS 6360',   '', '', 'A-', '', 'unsure'),
            Class('Virtual Reality', 'CS 6334',   '', '', 'B', '', 'unsure'),
            Class('Theory of Computation', 'CS 6382', '21f', '', 'A', '', 'unsure'),
            Class('Natural Language Processing', 'CS 6320',   '22s', '', 'A', '', 'unsure'),
            Class('Network Security', 'CS 6349',  '22f', '', '', '', 'unsure'),
            Class('Sftwr Test/Validatn/Verificatn', 'CS 6367','22f', '', '', '', 'unsure'),
            Class('Software Maint Evolut & Re-Eng', 'SE 6356','23s', '', '', '', 'unsure'),
            Class('Computer Science I', 'CS 5303','23s', '', '', '', 'unsure'),
            Class('Computer Science II', 'CS 5330',   '23s', '', '', '', 'unsure'),
            Class('Discrete Structures', 'CS 5333',   '', '', '', '', 'unsure'),
            Class('Algorithm Analysis & Data Structures', 'CS 5343',  '', '', '', '', 'unsure'),
            Class('Operating System Concepts', 'CS 5348', '', '', '', '', 'unsure'),
            Class('Probability & Statistics in CS<<', 'CS 3341<<','', '', '*** A- ***', '', 'unsure'),
        ]
        return Student('Lasso, Ted', 2021504218, False, False, '21F', '', classes, '')
    else:
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

def json_to_student(json_obj):
    try:
        name = json_obj["name"]
    except KeyError:
        name = ''
    try:
        student_id = json_obj["studentId"]
    except KeyError:
        student_id = ''
    try:
        options = json_obj["options"]
        try:
            fastTrack = options["fastTrack"]
        except KeyError:
            fastTrack = ''
        try:
            thesis = options["thesis"]
        except KeyError:
            thesis = ''
    except KeyError:
        options = ''
        thesis = ''
        fastTrack = ''
    try:
        dates = json_obj["dates"]
        try:
            admitted_date = dates["admitted"]
        except KeyError:
            admitted_date = ''
        try:
            expected_graduation = dates["expected_graduation"]
        except KeyError:
            expected_graduation = ''
    except KeyError:
        dates = ''
        admitted_date = ''
        expected_graduation = ''
    try:
        track = json_obj["track"]
    except KeyError:
        track = ''

    classes = []
    try:
        for class_obj in json_obj["classes"]:
            try:
                class_name = class_obj["name"]
            except KeyError:
                class_name = ''
            try:
                class_number = class_obj["number"]
            except KeyError:
                class_number = ''
            try:
                class_semester = class_obj["semester"]
            except KeyError:
                class_semester = ''
            try:
                class_transfer = class_obj["transfer"]
            except KeyError:
                class_transfer = ''
            try:
                class_grade = class_obj["grade"]
            except KeyError:
                class_grade = ''
            try:
                class_attempted_credits = class_obj["attempted_credits"]
            except KeyError:
                class_attempted_credits = ''
            try:
                class_type = class_obj["type"]
            except KeyError:
                class_type = ''
            classes.append(Class(class_name, class_number, class_semester, class_transfer, class_grade, class_attempted_credits, class_type))
    except KeyError:
        pass

    return Student(name, student_id, fastTrack, thesis, admitted_date, expected_graduation, classes, track)

if __name__ == '__main__':
    print(getMockStudent())
