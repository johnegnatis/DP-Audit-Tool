try:
    from scripts.objects import Class, Student, StudentEncoder
except:
    from objects import Class, Student, StudentEncoder
import re
from docx import Document
from docx.shared import Pt
from docx.enum.section import WD_SECTION


def doAuditMethod(studentObject):

    print('Starting audit generation...')

    # Class tracking for GPA
    core_complete = [course for course in studentObject.classes if course.grade and (course.type == 'core' or course.type == 'one_of_the_following')]
    core_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'core']

    elective_complete = [course for course in studentObject.classes if course.grade and course.type == 'core_electives']
    elective_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'core_electives']

    total_complete = [course for course in studentObject.classes if course.grade and (course.type == 'core' or course.type == 'core_electives' or course.type == 'one_of_the_following')]
    total_incomplete = [course for course in studentObject.classes if not course.grade and (course.type == 'core' or course.type == 'core_electives')]


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
    para.add_run('Name: ').bold = True
    para.add_run(studentObject.name.ljust(24,' '))
    para.add_run('ID: ').bold = True
    para.add_run(str(studentObject.studentId))
    para.add_run('\nPlan: ').bold = True
    para.add_run('Master'.ljust(24,' '))
    para.add_run('Major: ').bold = True
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
    para.add_run(", ".join([course.number for course in (core_complete + core_incomplete)]))
    para.add_run('\nElective Courses: ').bold = True
    para.add_run(", ".join([course.number for course in (elective_complete + elective_incomplete)]))

    # leveling courses (incomplete) NEED LIST OF LEVELING COURSES HERE
    para = doc.add_paragraph()
    para.add_run('\nLeveling Courses and Pre-requisites from Admission Letter:').bold = True
    
    for course in studentObject.classes:
        if course.type == 'prerequisites' and course.grade:
             para.add_run("\n" + course.number + ": Completed" + course.semester)

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

    doc.save('Sample Audit.docx')
    print('Sample audit created.')

    return

def calculateRequiredGPA(required_GPA, GPA, completed_courses, remaining_courses):
    target = (required_GPA * (len(completed_courses) + len(remaining_courses)) - (GPA * len(completed_courses))) / len(remaining_courses)
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
    letter = " ".join(re.findall("[a-zA-Z][\+\-]?", letter))

    if letter == 'A':
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
        return 'C-'
    if letter == 'F':
        return 0.0
    
    return 'Ignore'

def getGPA(completed_courses):

    gpa = 0.0
    for course in completed_courses:
        gpa += letterToGPA(course.grade)
    
    return gpa / len(completed_courses)



# test case
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
mock = Student('Ted Lasso', 2021504218, False, False, '21F', '', classes, 'Data Science')

if __name__ == '__main__':
    doAuditMethod(mock)