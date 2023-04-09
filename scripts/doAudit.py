try:
    from scripts.objects import Class, Student, StudentEncoder
except:
    from objects import Class, Student, StudentEncoder
from docx import Document
from docx.shared import Pt
from docx.enum.section import WD_SECTION


def doAuditMethod(studentObject):

    print('Starting audit generation...')

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
    para.add_run(studentObject.name)
    para.add_run('\t\t\t\t\t\tID: ').bold = True
    para.add_run(str(studentObject.studentId))
    para.add_run('\nPlan: ').bold = True
    para.add_run('Master')
    para.add_run('\t\t\t\t\t\t\tMajor: ').bold = True
    if studentObject.track == 'Software Engineering':
        para.add_run('Software Engineering')
    else:
        para.add_run('Computer Science')
    para.add_run('\nTrack: ').bold = True
    para.add_run(studentObject.track)

    #GPA
    para = doc.add_paragraph()
    para.add_run('\nCore GPA: ').bold = True
    para.add_run('call GPA here')
    para.add_run('\nElective GPA: ').bold = True
    para.add_run('call GPA here')
    para.add_run('\nCombined GPA: ').bold = True
    para.add_run('call GPA here')

    core_gpa = 3.734
    elective_gpa = 3.667
    combined_gpa = 3.709

    # courses
    para = doc.add_paragraph()
    para.add_run('\nCore Courses: ').bold = True
    para.add_run(", ".join([course.number for course in studentObject.classes if course.type == 'core']))
    para.add_run('\nElective Courses: ').bold = True
    para.add_run(", ".join([course.number for course in studentObject.classes if course.type == 'core_electives']))

    # leveling courses (incomplete)
    para = doc.add_paragraph()
    para.add_run('\nLeveling Courses and Pre-requisites from Admission Letter:').bold = True
    
    for course in studentObject.classes:
        if course.type == 'prerequisites' and course.grade:
             para.add_run("\n" + course.number + ": Completed" + course.semester)


    # Class tracking for GPA
    core_complete = [course for course in studentObject.classes if course.grade and course.type == 'core']
    core_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'core']

    elective_complete = [course for course in studentObject.classes if course.grade and course.type == 'core_electives']
    elective_incomplete = [course for course in studentObject.classes if not course.grade and course.type == 'core_electives']

    total_complete = [course for course in studentObject.classes if course.grade and (course.type == 'core' or course.type == 'core_electives')]
    total_incomplete = [course for course in studentObject.classes if not course.grade and (course.type == 'core' or course.type == 'core_electives')]

    # requirements (incomplete)
    core_status = ""
    elective_status = ""
    overall_status = ""

    para = doc.add_paragraph()
    para.add_run('\nOutstanding Requirements:\n').bold = True

    if(len(core_incomplete) == 0):
        core_status = "Core complete."
    else:
        core_status = calculateRequiredGPA(3.19, core_gpa, core_complete, core_incomplete)
        para.add_run('\nTo maintain a 3.0 core GPA:')
        
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
        return "\tThe student must pass "
    return "\tThe student needs a GPA of at least %.3f in " % target

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