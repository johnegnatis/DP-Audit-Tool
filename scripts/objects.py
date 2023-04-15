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
    #'fast_track': 'fastTrack',
    'fast_track': 'Fast Track',
    'transfer' : 'Transfer',
    #'transfer': 'transfer',
    '': '',
}

typeOptions = {
     '': 'unsure',
     'unsure': 'unsure',
     'core': 'core',
     'following': 'following',
     'electives': 'electives',
     'additional': 'additional',
     'prerequisites': 'prerequisites',
    }

class Class:
    def __init__(self, name, number, semester, transfer, grade, attempted_credits, type = 'unsure', leveling=''):
        self.name = name
        self.number = number
        self.semester = semester
        self.transfer = transfer
        self.grade = grade
        self.attempted_credits = attempted_credits
        self.type = typeOptions[type]
        self.leveling = leveling

def mockStudent(unsure = False):
    if (unsure == True):
        classes = [
            Class('Statistical Methods for Data Science', 'CS 6313', '22S', '', 'A', '', 'unsure'),
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
            Class('Probability & Statistics in CS and SE', 'CS 3341<<','', '', '****A-', '', 'unsure'),
        ]
        return Student('Lasso, Ted', 2021504218, False, False, '21F', '', classes, 'Data Science')
    else:
        classes = [
            Class('Statistical Methods for Data Science', 'CS 6313', '22S', '', 'A', '', 'core'),
            Class('Big Data Management and Analytics', 'CS 6350', '22s', '', 'B+', '', 'core'),
            Class('Design and Analysis of Computer Algorithms', 'CS 6363','22s', '', 'A-', '', 'core'),
            Class('Machine Learning', 'CS 6375',  '21f', '', 'A', '', 'core'),
            Class('Social Network Analytics', 'CS 6301',  '22f', '', '', '', 'following'),
            Class('Natural Language Processing', 'CS 6320',   '21f', '', '', '', 'following'),
            Class('Video Analytics', 'CS 6327',   '', '', '', '', 'following'),
            Class('Statistics for Machine Learning', 'CS 6347',   '', '', '', '', 'following'),
            Class('Database Design', 'CS 6360',   '', '', 'A-', '', 'following'),
            Class('Virtual Reality', 'CS 6334',   '', '', 'B', '', 'electives'),
            Class('Theory of Computation', 'CS 6382', '21f', '', 'A', '', 'electives'),
            Class('Natural Language Processing', 'CS 6320',   '22s', '', 'A', '', 'electives'),
            Class('Network Security', 'CS 6349',  '22f', '', '', '', 'electives'),
            Class('Sftwr Test/Validatn/Verificatn', 'CS 6367','22f', '', '', '', 'electives'),
            Class('Software Maint Evolut & Re-Eng', 'SE 6356','23s', '', '', '', 'electives'),
            Class('Computer Science I', 'CS 5303','23s', '', '', '', 'additional'),
            Class('Computer Science II', 'CS 5330',   '23s', '', '', '', 'prerequisites'),
            Class('Discrete Structures', 'CS 5333',   '', '', '', '', 'prerequisites'),
            Class('Algorithm Analysis & Data Structures', 'CS 5343',  '', '', '', '', 'prerequisites'),
            Class('Operating System Concepts', 'CS 5348', '', '', '', '', 'prerequisites'),
            Class('Probability & Statistics in CS and SE', 'CS 3341<<','', '', '*** A- ***', '', 'prerequisites'),
        ]
        return Student('Lasso, Ted', 2021504218, False, False, '21F', '', classes, 'Data Science')

def getMockStudent():
    return mockStudent().packStudentObject()

def get_key(json_obj, key):
    try:
        return json_obj[key]
    except Exception as e:
        print(e)
        print(f"Key '{key}' not found in JSON object (non-issue unless key is important)")
        return ''

def json_to_student(json_obj):
    name = get_key(json_obj, 'name')
    student_id = get_key(json_obj, 'studentId')
    options = get_key(json_obj, "options")
    if (options):
        fastTrack = get_key(options, "fastTrack");
        thesis = get_key(options, "thesis");
    else:
        fastTrack = ''
        thesis = ''
    dates = get_key(json_obj, "dates")
    if (dates):
        admitted_date = get_key(dates, "admitted");
        expected_graduation = get_key(dates, "expected_graduation");
    else:
        admitted_date = ''
        expected_graduation = ''
    track = get_key(json_obj, 'track')
    classes = []
    classList = get_key(json_obj, 'classes')
    if (classList):
        for class_obj in classList:
            class_name = get_key(class_obj, 'name')
            class_number = get_key(class_obj, 'number')
            class_semester = get_key(class_obj, 'semester')
            class_transfer = get_key(class_obj, 'transfer')
            class_grade = get_key(class_obj, 'grade')
            class_attempted_credits = get_key(class_obj, 'attempted_credits')
            class_type = get_key(class_obj, 'type')
            leveling = get_key(class_obj, 'leveling')
            classes.append(Class(class_name, class_number, class_semester, class_transfer, class_grade, class_attempted_credits, class_type, leveling))
    else:
        print('Classes not found')

    return Student(name, student_id, fastTrack, thesis, admitted_date, expected_graduation, classes, track)
