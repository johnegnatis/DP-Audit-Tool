import pdfplumber
import json
from scripts.objects import Class, Student, StudentEncoder
import re
import pdfplumber
import pandas as pd
from collections import namedtuple

#TODO: does not fill object entirely yet (experiment with spacing -> pdfplumber)
#TODO semester admitted: "21F... 21S... etc"

def getDataFromTranscriptMethod(file_path):

    line_items = []
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
    class_col = re.compile(r'^[A-Za-z0-9]+\s[0-9]+ .*')
    data = namedtuple('data', 'semester course_prefix course_code course_name attempted_credits grade')

    # try: REMOVED TRY TO CATCH ERROR IN CONSOLE
    classes = []
    text = ''
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            current_page = page
            text += current_page.extract_text(x_tolerance=2, y_tolerance=3, layout=False, x_density=7.25, y_density=13) + '\n'

    # EXTRACTION:
    data_list = text.split('\n')
    foundSemAdmitted = 0
    for line in data_list:
        if re.compile(r'^Name').match(line): # STUDENT NAME
            name = line.split(" ")
            student_name = " ".join(name[1:len(name)])
            
        if re.compile(r'^Student ID').match(line): # STUDENT ID
            id = line.split(" ")
            student_id = "".join(id[2])
            
        if re.compile(r'^\d{4}\-\d{2}\-\d{2}\:\s.*Major$').match(line): # STUDENT MAJOR
            x = line.split(" ")
            major = " ".join(x[1:len(x) - 1])
            
        if re.compile(r'^Beginning of Graduate Record').match(line): # helper to find semester_admitted
            foundSemAdmitted += 1

        if re.compile(r'^\d{4}\s').match(line): # SEMESTER + SEMESTER ADMITTED
            if foundSemAdmitted == 1:
                semester_admitted = line
                foundSemAdmitted = 0
            #x = line.split(" ")
            semester = line
        
        if re.compile(r'^Combined Cum GPA').match(line): # TOTAL COMBINED COMULATIVE GPA
            x = line.split(" ")
            combined_cumulative_GPA = x[3]

        if class_col.match(line): # COURSE PREFIX + CODE, COURSE NAME/DESCRIPTION, ATTEMPTED CREDITS, GRADE
            new_class_col= line.split(" ")
            course_prefix = " ".join(new_class_col[0:1])
            course_code = " ".join(new_class_col[1:2])
            course_num = " ".join(new_class_col[0:2])

            temp = new_class_col[(len(new_class_col)-4)]
            if( not(temp[0] == "3" or temp[0]=="0" or temp[0]=="1") ): # if grade is blank (class is being currently attempted)
                course_name = " ".join(new_class_col[2:len(new_class_col)-3])
                grade = ""
                attempted_credits = "".join(new_class_col[(len(new_class_col)-3):(len(new_class_col)-2)])
            else: # if grade is not blank
                course_name = " ".join(new_class_col[2:len(new_class_col)-4])
                grade = "".join(new_class_col[(len(new_class_col)-2):(len(new_class_col)-1)])
                attempted_credits = "".join(new_class_col[(len(new_class_col)-4):(len(new_class_col)-3)])
            myClass = Class('name', course_num, semester, '', grade, 1)
            classes.append(myClass)
            line_items.append(data(semester, course_prefix, course_code, course_name, attempted_credits, grade))
    
    # ------------ section will be removed later (for debugging)
    df = pd.DataFrame(line_items)
    print("Student Name: " + student_name)
    print("Student ID: " + student_id)
    print("Major: " + major)
    print("Combined Cumulative GPA: " + combined_cumulative_GPA)
    print("Semester Admitted: " + semester_admitted)
    print(df)
    # ------------
    studentObj = Student(student_name, student_id, True, False, semester_admitted, '1/1/2023', classes)
    return studentObj.packStudentObject()

# function used to debug (remove later)
if __name__ == '__main__':
    getDataFromTranscriptMethod()

    # TODO: REMOVE THIS BACK LATER WHEN FINISH TESTING
    # except:
    #     raise Exception("This file cannot be read. Ensure that it is a PDF file and please try again.")