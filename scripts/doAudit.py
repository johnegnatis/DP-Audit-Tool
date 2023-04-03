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

    # courses
    para = doc.add_paragraph()
    corecourses = []
    electivecourses = []
    for course in studentObject.classes:
        if course.type == 'core':
            corecourses.append(course.number)
        if course.type == 'core_electives' or 'additional_electives':
            electivecourses.append(course.number)
    para.add_run('\nCore Courses: ').bold = True
    para.add_run(", ".join(corecourses))
    para.add_run('\nElective Courses: ').bold = True
    para.add_run(", ".join(electivecourses))

    # leveling courses (incomplete)
    para = doc.add_paragraph()
    para.add_run('\nLeveling Courses and Pre-requisites from Admission Letter:').bold = True
    para.add_run('\n\nList courses here')

    # requirements (incomplete)
    para = doc.add_paragraph()
    para.add_run('\nOutstanding Requirements:').bold = True
    para.add_run('\n\nCore status.')
    para.add_run('\nTo maintain a 3.0 elective GPA:')
    para.add_run('\n    The student must pass [List classes]')
    para.add_run('\nTo maintain a 3.0 overall GPA:')
    para.add_run('\n    The student must pass [List classes]')


    doc.save('Sample Audit.docx')
    print('Sample audit created.')

    return

# test case
classes = [Class('Statistical Methods for Data Sciences', 'CS 6313', '22S', '', 'A', '', 'core'),
    Class('Big Data Management and Analytics', 'CS 6350', '22s', '', 'B+', '', 'core'),
    Class('Design and Analysis of Computer Algorithms', 'CS 6363','22s', '', 'A-', '', 'core')]
mock = Student('Ted Lasso', 2021504218, False, False, '21F', '', classes, 'Data Science')

if __name__ == '__main__':
    doAuditMethod(mock)