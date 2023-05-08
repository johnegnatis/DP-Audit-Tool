from pdfplumber import open as open_pdf
try:
    from scripts.objects import Class, Student
    from scripts.makeDegreePlan import readStudentObject
except Exception:
    from makeDegreePlan import readStudentObject
    from objects import Class, Student
from re import compile as regex_compile
from collections import namedtuple


def getDataFromTranscriptMethod(file_path):

    try:
        studentObject = readStudentObject(file_path)
        return studentObject
    except Exception as e:
        # If this fails we assume it is transcript
        pass

    line_items = []
    blacklist = []
    semester_admitted = ""
    combined_cumulative_GPA = ""
    course_code = ""
    course_prefix = ""
    course_num = ""
    course_name = ""
    student_id = ''
    student_name = ''
    grade = ""
    semester = ""
    transferOption = ""

    data = namedtuple('data', 'semester course_prefix course_code course_name attempted_credits grade transfer_or_fast_track')

    try: 
        classes = []
        transfers = []
        text = ''
        with open_pdf(file_path) as pdf:
            for page in pdf.pages:
                current_page = page
                text += current_page.extract_text(x_tolerance=2, y_tolerance=3, layout=False, x_density=7.25, y_density=13) + '\n'
    except IOError as ex:
        print ('IOError thrown. File not found. Details: {ex}')
        raise Exception("Error: File could not be opened.")
    except Exception as e:
        raise Exception("Error: Error parsing transcript.")

    # EXTRACTION:
    data_list = text.split('\n')
    foundSemAdmitted = 0
    transferCt = 0
    fasttrackCt = 0
    extractingGradInfo = False

    for line in data_list:
        line = " ".join(line.split())
        if regex_compile(r'^Name').match(line): # STUDENT NAME
            name = line.split(" ")
            student_name = " ".join(name[1:])
            
        elif regex_compile(r'^Student ID').match(line): # STUDENT ID
            id = line.split(" ")
            student_id = "".join(id[2])
        
        elif regex_compile(r'^\d{4}\-\d{2}\-\d{2}\:\s.*Major$').match(line): # STUDENT MAJOR - bypasses undergrad major if necessary
            x = line.split(" ")
            major = " ".join(x[1:-1])
        
        # TO PREVENT UNDERGRAD INFO FROM BEING EXTRACTED
        if extractingGradInfo==True or regex_compile(r'^Beginning of Graduate Record').match(line) or regex_compile(r'^Transfer Credit from UT Dallas Fast Track').match(line) or regex_compile(r'^Transfer Credit from The University of Texas at Dallas').match(line):
            
            extractingGradInfo = True
        
            # FAST TRACK SECTION OCCURS BEFORE TRANSFER
            if regex_compile(r'^Transfer Credit from UT Dallas Fast Track').match(line):
                fasttrackCt = 1
            
            # TRANSFER SECTION OCCURS BEFORE GRAD RECORD
            elif regex_compile(r'^Transfer Credit from The University of Texas at Dallas').match(line):
                fasttrackCt = 0 # fast track classes done, new transfer section in transcript
                transferOption = ""
                transferCt = 1

            # HELPER - finds semester_admitted, resets fast_track and transfer (no more past this point)
            elif regex_compile(r'^Beginning of Graduate Record').match(line):
                foundSemAdmitted += 1
                fasttrackCt = 0
                transferCt = 0
                transferOption = ""

            elif regex_compile(r'^\d{4}\s').match(line): # SEMESTER + SEMESTER ADMITTED
                semester = line[2:4]
                term = line[5:]
                if term == "Spring":
                    semester += "S"
                elif term == "Fall":
                    semester += "F"
                else: # "Summer"
                    semester += "U" 
                if foundSemAdmitted == 1:
                    semester_admitted = semester
                    foundSemAdmitted = 0
        
            elif regex_compile(r'^Combined Cum GPA').match(line): # TOTAL COMBINED COMULATIVE GPA
                x = line.split(" ")
                combined_cumulative_GPA = x[3]
                                

            # COURSE PREFIX + CODE, COURSE NAME/DESCRIPTION, ATTEMPTED CREDITS, GRADE, TRANSFER/FAST TRACK
            elif regex_compile(r'^[A-Za-z0-9]+\s[0-9]+ .*').match(line):
                new_class_col= line.split(" ")
                course_prefix = " ".join(new_class_col[:1])
                course_code = " ".join(new_class_col[1:2])
                course_num = " ".join(new_class_col[:2])

                if(transferCt == 1):
                    fasttrackCt = 0 # no more fast track classes
                    transferOption = "Transfer"
                    
                if (fasttrackCt == 1):
                    transferOption = "Fast Track"

                temp = new_class_col[(len(new_class_col)-4)]
                if temp[0] not in ["3", "0", "1"]: # if grade is blank (class is being currently attempted)
                    course_name = " ".join(new_class_col[2:len(new_class_col)-3])
                    grade = ""
                    attempted_credits = "".join(new_class_col[(len(new_class_col)-3):(len(new_class_col)-2)])
                else: # if grade is not blank
                    course_name = " ".join(new_class_col[2:len(new_class_col)-4])
                    grade = "".join(new_class_col[len(new_class_col)-2:-1])
                    attempted_credits = "".join(new_class_col[(len(new_class_col)-4):(len(new_class_col)-3)])
                
                # ADDING TO CLASS OBJECT
                if (course_prefix != "ECSC"): # ignores CS IPP Assignment (+ any other blacklisted classes)
                    
                    myClass = Class(course_name, course_num, semester, transferOption, grade, attempted_credits) 
                    classes.append(myClass)
                    line_items.append(data(semester, course_prefix, course_code, course_name, attempted_credits, grade, transferOption))
                
                else:
                    blacklist.append(data(semester, course_prefix, course_code, course_name, attempted_credits, grade, transferOption))
    
    studentObj = Student(student_name, student_id, False, False, semester_admitted, '', classes)

    if not student_name or not student_id:
        raise Exception("Error: Could not get Student's name or ID from this PDF. This document is likely not a transcript.")

    print(studentObj.packStudentObject())
    return studentObj.packStudentObject()