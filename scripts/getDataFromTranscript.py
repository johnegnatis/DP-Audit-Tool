import pdfplumber
import json
from scripts.objects import Class, Student, StudentEncoder
import re
import pdfplumber
import pandas as pd
from collections import namedtuple

#TODO: EXTRACT SEMESTER ADMITTED, COURSES: ATTEMPTED CREDITS
# - fix extractions

def getDataFromTranscriptMethod(file_path):
    print(file_path)
    line_items = []
    sem_col = re.compile(r'^\d{4}\s')
    class_col = re.compile(r'^[A-Za-z0-9]+\s[0-9]+ .*')
    s_name = re.compile(r'^Name')
    s_id = re.compile(r'^Student ID')
    major_col = re.compile(r'^\d{4}\-\d{2}\-\d{2}\:\s.*Major$')
    course_num = ""
    course_name = ""
    student_id = ''
    student_name = ''
    grade = ""
    semester = ""
    data = namedtuple('data', 'semester course_num course_name attempted_credits grade')

    # root = Tk()
    # root.withdraw()
    # root.wm_attributes('-topmost', 1)
    # file_path = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")))

    # try: REMOVED TRY TO CATCH ERROR IN CONSOLE
    classes = []
    text = ''
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            current_page = page
            kwargs = { 
                'keep_blank_chars': True,
                'use_text_flow': False,
                'horizontal_ltr': True,
                'vertical_ttb': True,
                'extra_attrs': [],
                'split_at_punctuation': False
                }
            text += current_page.extract_text()

    # EXTRACTION:
    data_list = text.split('\n')
    for line in data_list:
        if s_name.match(line):
            name = line.split(" ")
            student_name = " ".join(name[1:len(name)])
            print(student_name)

        if s_id.match(line):
            id = line.split(" ")
            student_id = "".join(id[2])
            print(student_id)

        if major_col.match(line):
            x = line.split(" ")
            major = " ".join(x[1:len(x) - 1])
            print(major)

        if sem_col.match(line): # SEMESTER
            x = line.split(" ")
            semester = line

        if class_col.match(line):
            new_class_col= line.split(" ")
            course_num = " ".join(new_class_col[0:2])
            course_name = " ".join(new_class_col[2:len(new_class_col)-4])
            grade = "".join(new_class_col[(len(new_class_col)-2):(len(new_class_col)-1)])
            attempted_credits = "".join(new_class_col[(len(new_class_col)-4):(len(new_class_col)-3)])
            #print(course_num)
            myClass = Class('core', course_num, semester, grade)
            classes.append(myClass)
            line_items.append(data(semester, course_num, course_name, attempted_credits, grade))
        # df = pd.DataFrame(line_items)
        
    studentObj = Student(student_name, student_id, True, False, '1/1/2020', '1/1/2023', classes)
    return studentObj.packStudentObject()

    # TODO: REMOVE THIS BACK LATER WHEN FINISH TESTING
    # except:
    #     raise Exception("This file cannot be read. Ensure that it is a PDF file and please try again.")