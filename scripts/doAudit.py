try:
    from scripts.objects import Class, Student, StudentEncoder, mockStudent, json_to_student
    from scripts.fileSystemInteraction import getDirectory
    from scripts.settings import get_setting
    from scripts.helpers import get_naming_convention
except Exception as e:
    from objects import Class, Student, StudentEncoder, mockStudent, json_to_student
    from fileSystemInteraction import getDirectory
    from settings import get_setting  
    from helpers import get_naming_convention
import re
from docx import Document
from docx.shared import Pt
from docx.enum.section import WD_SECTION

def doAuditMethod(studentObject):

    if (studentObject == 'mock'):
        studentObject = mockStudent()
    else:
        studentObject = json_to_student(studentObject)

    default_path = get_setting("default-path-for-audit")
    file_path = getDirectory('Save Audit Report', default_path)
    if not file_path:
        return

    destination = file_path + '/' + get_naming_convention(studentObject.name) + '_Audit.docx'
    try:
        generateAudit(studentObject, destination)
    except Exception as e:
        print(e)
        raise Exception("Error: Error at audit generation. Please try again later.")
    return destination

def generateAudit(studentObject, destination):
    # Class tracking for GPA
    core_complete = [course for course in studentObject.classes if course.grade and (course.type == 'core' or course.type == 'following')]
    core_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'core']

    elective_complete = [course for course in studentObject.classes if course.grade and course.type == 'electives']
    elective_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'electives']

    total_complete = [course for course in studentObject.classes if course.grade and (course.type == 'core' or course.type == 'electives' or course.type == 'following')]
    total_incomplete = [course for course in studentObject.classes if not course.grade and (course.type == 'core' or course.type == 'electives')]

    core_complete.sort(key=lambda x: x.number)
    core_incomplete.sort(key=lambda x: x.number)
    elective_complete.sort(key=lambda x: x.number)
    elective_incomplete.sort(key=lambda x: x.number)
    total_complete.sort(key=lambda x: x.number)
    total_incomplete.sort(key=lambda x: x.number)


    doc = Document()
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(12)

    # title
    para = doc.add_paragraph()
    para.add_run('Audit Report\n').bold = True
    para.alignment = 1

    # basic information
    para = doc.add_paragraph()

    inch = 914400
    tab_stops = para.paragraph_format.tab_stops
    tab_stop = tab_stops.add_tab_stop(round(inch*4))

    para.add_run('Name: ').bold = True
    para.add_run(studentObject.name)
    para.add_run('\tID: ').bold = True
    para.add_run(str(studentObject.studentId))
    para.add_run('\nPlan: ').bold = True
    para.add_run('Master')
    para.add_run('\tMajor: ').bold = True
    if studentObject.track == 'Software Engineering':
        para.add_run('Software Engineering')
    else:
        para.add_run('Computer Science')
    para.add_run('\nTrack: ').bold = True
    para.add_run(studentObject.track)

    #GPA
    core_gpa = getGPA(core_complete)
    elective_gpa = getGPA(elective_complete)
    combined_gpa = getGPA(total_complete)

    para = doc.add_paragraph()
    para.add_run('\nCore GPA: ').bold = True
    para.add_run('%.3f' % core_gpa)
    para.add_run('\nElective GPA: ').bold = True
    para.add_run('%.3f' % elective_gpa)
    para.add_run('\nCombined GPA: ').bold = True
    para.add_run('%.3f' % combined_gpa)

    # courses
    para = doc.add_paragraph()
    para.add_run('\nCore Courses: ').bold = True

    cores = core_complete + core_incomplete
    cores.sort(key=lambda x: x.number)
    para.add_run(", ".join([course.number for course in (core_complete + core_incomplete)]))


    para.add_run('\nElective Courses: ').bold = True

    electives = elective_complete + elective_incomplete
    electives.sort(key=lambda x: x.number)
    para.add_run(", ".join([course.number for course in (elective_complete + elective_incomplete)]))

    # leveling courses (incomplete) NEED LIST OF LEVELING COURSES HERE
    para = doc.add_paragraph()
    para.add_run('\nLeveling Courses and Pre-requisites from Admission Letter:').bold = True
    
    for course in studentObject.classes:
        if course.type == 'prerequisites' and course.grade:
             c = "".join(re.findall("[a-zA-Z]* [0-9]*", course.number))
             para.add_run("\n" + c + ": Completed" + course.semester)

    # requirements (incomplete)
    core_status = ""
    elective_status = ""
    overall_status = ""

    para = doc.add_paragraph()
    para.add_run('\nOutstanding Requirements:\n').bold = True

    
    # Taking extra course?
    extra_course = False

    if(len(core_incomplete) == 0):
        core_status = "Core complete."
    elif(extra_course):
        core_status = calculateRequiredGPA(3.0, core_gpa, core_complete, core_incomplete)
        para.add_run('\nTo maintain a 3.0 core GPA:')
    else:
        ore_status = calculateRequiredGPA(3.19, core_gpa, core_complete, core_incomplete)
        para.add_run('\nTo maintain a 3.19 core GPA:')
        
    para.add_run('\n' + core_status + ", ".join(course.number for course in core_incomplete))
    
    if(len(elective_incomplete) == 0):
        elective_status = "Elective complete."
    else:
        elective_status = calculateRequiredGPA(3.0, elective_gpa, elective_complete, elective_incomplete)
        para.add_run('\nTo maintain a 3.0 elective GPA:')
    
    para.add_run('\n' + elective_status + ", ".join(course.number for course in elective_incomplete))

    if(len(total_incomplete) == 0):
        overall_status = "Overall complete."
    else:
        overall_status = calculateRequiredGPA(3.0, combined_gpa, total_complete, total_incomplete)
        para.add_run('\nTo maintain a 3.0 overall GPA:')
    
    para.add_run('\n' + overall_status + ", ".join(course.number for course in total_incomplete))

    try:
        doc.save(destination)
    except PermissionError:
        raise Exception("Error: You do not have permissions to save here. Perhaps you have an older version open. Close out other applications and try again.")

def calculateRequiredGPA(required_GPA, GPA, completed_courses, remaining_courses):
    target = (required_GPA * (getTotalCredits(completed_courses) + getTotalCredits(remaining_courses)) - (GPA * getTotalCredits(completed_courses))) / getTotalCredits(remaining_courses)
    if target < 2:
        return "\tThe student must pass: "
    
    if remaining_courses == 1:
        grade = 'Error'

        if target > 4.0:
            grade = 'Impossible'
        elif target > 3.670:
            grade = 'A'
        elif target > 3.330:
            grade = 'A-'
        elif target > 3:
            grade = 'B+'
        elif target > 2.670:
            grade = 'B'
        elif target > 2.330:
            grade = 'B-'
        elif target > 2:
            grade = 'C+'
            
        return "\tThe student needs a grade >=", grade, "in: "
    
    return "\tThe student needs a GPA of at least %.3f in: " % target

def letterToGPA(letter):
    letter = "".join(re.findall("[a-zA-Z][\+\-]?", letter))
    letter = letter.upper() # incase DP enters lowercase letter

    if letter == 'A' or letter == 'A+':
        return 4.0
    if letter == 'A-':
        return 3.670
    if letter == 'B+':
        return 3.330
    if letter == 'B':
        return 3.000
    if letter == 'B-':
        return 2.670
    if letter == 'C+':
        return 2.330
    if letter == 'C':
        return 2.000
    if letter == 'F':
        return 0.0
    
    return 'Ignore'

def getGPA(completed_courses):

    gpa = 0.0
    courseCount = 0

    for course in completed_courses:
        grade = letterToGPA(course.grade)
        if (grade == 'Ignore'):
            continue

        credits = int(course.number[4])
        
        courseCount = courseCount + credits
        gpa += grade*credits
    
    try:
        return gpa / courseCount
    except Exception as e:
        # DIVIDE BY 0 ERROR?
        return 0

def getTotalCredits(courses):
    sum = 0
    for course in courses:
        sum += int(course.number[4])

    return sum

if __name__ == '__main__':
    doAuditMethod('mock')