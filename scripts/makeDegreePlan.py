try:
    from scripts.objects import Class, Student, mockStudent, json_to_student
    from scripts.helpers import get_server_path
    from scripts.database import open_database
except:
    from objects import Class, Student, mockStudent
    from helpers import get_server_path
    from database import open_database

import fillpdf
from fillpdf import fillpdfs 

import json
from tkinter import filedialog
from tkinter import *
import os

def get_pdf_type_from_database(database, student_track):
    track_obj = None
    for track in database["tracks"]:
        if track["name"] == student_track:
            track_obj = track
            break

    if not track_obj:
        raise Exception("Error:Track name not valid")

    pdf_type_found = None
    for pdf_type in database["pdf-types"].keys():
        if track_obj["pdf-type"] == pdf_type:
            pdf_type_found = pdf_type
    
    if not pdf_type_found:
        raise Exception("Error:PDF Type not found")
    
    return pdf_type_found

def get_pdf_name_from_database(database, student_track):
    track_obj = None
    for track in database["tracks"]:
        if track["name"] == student_track:
            track_obj = track
            break

    if not track_obj:
        raise Exception("Error:Track name not valid")

    return track_obj["pdf"]

def fillPDFForms(studentObject, path):
    database = open_database()
    pdf_name = get_pdf_name_from_database(database, studentObject.track)
    pdf_type = get_pdf_type_from_database(database, studentObject.track)
    pdf_table_sizes = database["pdf-types"][pdf_type]["pdf-table-size"]
    core_max_size = int(pdf_table_sizes["core"])
    following_max_size = int(pdf_table_sizes["following"])
    electives_max_size = int(pdf_table_sizes["electives"])
    additional_max_size = int(pdf_table_sizes["additional"])
    prerequisites_max_size = int(pdf_table_sizes["prerequisites"])
    padding = 10

    if (studentObject.options['fastTrack'] == False):
        isFT = "No"
    else:
        isFT = "Yes"

    if (studentObject.options['thesis'] == False):
        isThesis = "No"
    else:
        isThesis = "Yes"

    coreName = [""] * (core_max_size + padding) 
    coreNum = [""] * (core_max_size + padding) 
    coreSem = [""] * (core_max_size + padding) 
    coreTransfer = [""] * (core_max_size + padding) 
    coreGrade = [""] * (core_max_size + padding) 
    coreAC = [""] * (core_max_size + padding) 

    j = 0
    class_data = studentObject.classes
    for i in class_data:
        if (i.type == "core"):
            coreName[j] = (i.name)
            coreNum[j] = (i.number)
            coreSem[j] = (i.semester)
            coreTransfer[j] = (i.transfer)
            coreGrade[j] = i.grade
            coreAC[j] = i.attempted_credits
            j = j+1
            if (j >= core_max_size):
                break # if we are to combine all the data into one here, we simply append the arrays we just modified with the new classes we find

    followingName = [""] * (following_max_size + padding) 
    followingNum = [""] * (following_max_size + padding) 
    followingSem = [""] * (following_max_size + padding) 
    followingTransfer = [""] * (following_max_size + padding) 
    followingGrade = [""] * (following_max_size + padding) 
    followingAC = [""] * (following_max_size + padding) 

    j = 0
    class_data = studentObject.classes
    for i in class_data:
        if (i.type == "following"):
            followingName[j] = (i.name)
            followingNum[j] = (i.number)
            followingSem[j] = (i.semester)
            followingTransfer[j] = (i.transfer)
            followingGrade[j] = i.grade
            followingAC[j] = i.attempted_credits
            j = j+1
            if (j >= following_max_size):
                break # if we are to combine all the data into one here, we simply append the arrays we just modified with the new classes we find

    electiveName = [""] * (electives_max_size + padding) 
    electiveNum = [""] * (electives_max_size + padding) 
    electiveSem = [""] * (electives_max_size + padding) 
    electiveTransfer = [""] * (electives_max_size + padding) 
    electiveGrade = [""] * (electives_max_size + padding) 
    electiveAC = [""] * (electives_max_size + padding) 

    j = 0
    class_data = studentObject.classes
    for i in class_data:
        if (i.type == "electives"):
            electiveName[j] = (i.name)
            electiveNum[j] = (i.number)
            electiveSem[j] = (i.semester)
            electiveTransfer[j] = (i.transfer)
            electiveGrade[j] = (i.grade)
            electiveAC[j] = (i.attempted_credits)
            j = j+1
            if (j >= electives_max_size):
                break # if we are to combine all the data into one here, we simply append the arrays we just modified with the new classes we find

    addElectiveName = [""] * (additional_max_size + padding) 
    addElectiveNum = [""] * (additional_max_size + padding) 
    addElectiveSem = [""] * (additional_max_size + padding) 
    addElectiveTransfer = [""] * (additional_max_size + padding) 
    addElectiveGrade = [""] * (additional_max_size + padding) 
    addElectiveAC = [""] * (additional_max_size + padding) 

    j = 0
    class_data = studentObject.classes
    for i in class_data:
        if (i.type == "additional"):
            addElectiveName[j] = (i.name)
            addElectiveNum[j] = (i.number)
            addElectiveSem[j] = (i.semester)
            addElectiveTransfer[j] = (i.transfer)
            addElectiveGrade[j] = (i.grade)
            addElectiveAC[j] = (i.attempted_credits)
            j = j+1
            if (j >= additional_max_size):
                break # if we are to combine all the data into one here, we simply append the arrays we just modified with the new classes we find

    prereqName = [""] * (prerequisites_max_size + padding) 
    prereqNum = [""] * (prerequisites_max_size + padding) 
    prereqSem = [""] * (prerequisites_max_size + padding) 
    prereqWaiver = [""] * (prerequisites_max_size + padding) 
    prereqGrade = [""] * (prerequisites_max_size + padding) 
    prereqAC = [""] * (prerequisites_max_size + padding) 

    j = 0
    class_data = studentObject.classes
    for i in class_data:
        if (i.type == "prerequisites"):
            if(i.leveling != ''):
                prereqName[j] = "***" + i.name + "***"
                prereqNum[j] = "***" + i.number + "***"
            else:
                prereqName[j] = i.name
                prereqNum[j] = i.number
            prereqGrade[j] = i.grade
            prereqSem[j] = i.semester
            prereqWaiver[j] = i.transfer
            prereqAC[j] = i.attempted_credits
            j = j+1
            if (j >= prerequisites_max_size):
                break # if we are to combine all the data into one here, we simply append the arrays we just modified with the new classes we find

    if (int(pdf_type) == 2):
      data_dict = {
        "Name of Student": studentObject.name,
        "Student ID Number": studentObject.studentId,
        "Semester Admitted to Program": studentObject.dates['admitted'],
        "Graduation": studentObject.dates['expected_graduation'],
        "ct1": coreName[0],
        "cn1": coreNum[0],
        "coreSem1": coreSem[0],
        "coreTransfer1": coreTransfer[0],
        "coreGrade1": coreGrade[0],
        "ct2": coreName[1],
        "cn2": coreNum[1],
        "coreSem2": coreSem[1],
        "coreTransfer2": coreTransfer[1],
        "coreGrade2": coreGrade[1],
        "ct3": coreName[2],
        "cn3": coreNum[2],
        "coreSem3": coreSem[2],
        "coreTransfer3": coreTransfer[2],
        "coreGrade3": coreGrade[2],
        "ct4": coreName[3],
        "cn4": coreNum[3],
        "coreSem4": coreSem[3],
        "coreTransfer4": coreTransfer[3],
        "coreGrade4": coreGrade[3],
        "ct5": coreName[4],
        "cn5": coreNum[4],
        "coreSem5": coreSem[4],
        "coreTransfer5": coreTransfer[4],
        "coreGrade5": coreGrade[4],
        "cn6": coreNum[5],
        "coreSem6": coreSem[5],
        "coreTransfer6": coreTransfer[5],
        "coreGrade6": coreGrade[5],
        "ct7": electiveName[0],
        "ct8": electiveName[1],
        "ct9": electiveName[2],
        "ct10": electiveName[3],
        "ct11": electiveName[4],
        "ct12": addElectiveName[0],
        "ct13": addElectiveName[1],
        "ct14": addElectiveName[2],
        "otherReq1": "",
        "ct15": "",
        "cn15": "",
        "Sem15": "",
        "Transfer15": "",
        "Grade15":"",
        "otherReq2": "",
        "ct16": "",
        "cn16": "",
        "Sem16": "",
        "Transfer16": "",
        "Grade16": "",
        "prereq1": prereqName[0],
        "cn17": prereqNum[0],
        "Sem17": prereqSem[0],
        "Waiver1": prereqWaiver[0],
        "Grade17": prereqGrade[0],
        "prereq2": prereqName[1],
        "cn18": prereqNum[1],
        "Sem18": prereqSem[1],
        "Waiver2": prereqWaiver[1],
        "Grade18": prereqGrade[1],
        "prereq3": prereqName[2],
        "cn19": prereqNum[2],
        "Sem19": prereqSem[2],
        "Waiver3": prereqWaiver[2],
        "Grade19": prereqGrade[2],
        "prereq4": prereqName[3],
        "cn20": prereqNum[3],
        "Sem20": prereqSem[3],
        "Waiver4": prereqWaiver[3],
        "Grade20": prereqGrade[3],
        "prereq5": prereqName[4],
        "cn21": prereqNum[4],
        "Sem21": prereqSem[4],
        "Waiver5": prereqWaiver[4],
        "Grade21": prereqGrade[4],
        "prereq6": prereqName[5],
        "cn22": prereqNum[5],
        "Sem22": prereqSem[5],
        "Waiver6": prereqWaiver[5],
        "Grade22": prereqGrade[5],
        "prereq7": prereqName[6],
        "cn23": prereqNum[6],
        "Sem23": prereqSem[6],
        "Waiver7": prereqWaiver[6],
        "Grade23": prereqGrade[6],
        "prereq8": prereqName[7],
        "cn24": prereqNum[7],
        "Sem24": prereqSem[7],
        "Waiver8": prereqWaiver[7],
        "Grade24": prereqGrade[7],
        "prereq9": prereqName[8],
        "cn25": prereqNum[8],
        "Sem25": prereqSem[8],
        "Waiver9": prereqWaiver[8],
        "Grade25": prereqGrade[8],
        "Academic Advisor": "",
        "Date Submitted": "",
        "cn7": electiveNum[0],
        "cn8": electiveNum[1],
        "cn9": electiveNum[2],
        "cn10": electiveNum[3],
        "cn11": electiveNum[4],
        "cn12": addElectiveNum[0],
        "cn13": addElectiveNum[1],
        "cn14": addElectiveNum[2],
        "Sem7": electiveSem[0],
        "Sem8": electiveSem[1],
        "Sem9": electiveSem[2],
        "Sem10": electiveSem[3],
        "Sem11": electiveSem[4],
        "Transfer7": electiveTransfer[0],
        "Transfer8": electiveTransfer[1],
        "Transfer9": electiveTransfer[2],
        "Transfer10": electiveTransfer[3],
        "Transfer11": electiveTransfer[4],
        "Grade7": electiveGrade[0],
        "Grade8": electiveGrade[1],
        "Grade9": electiveGrade[2],
        "Grade10": electiveGrade[3],
        "Grade11": electiveGrade[4],
        "Sem12": addElectiveSem[0],
        "Sem13": addElectiveSem[1],
        "Sem14": addElectiveSem[2],
        "Transfer12": addElectiveSem[0],
        "Transfer13": addElectiveSem[1],
        "Transfer14": addElectiveSem[2],
        "Grade12": addElectiveGrade[0],
        "Grade13": addElectiveGrade[1],
        "Grade14": addElectiveGrade[2],
        "fastTrack": isFT,
        "thesis": isThesis,
        "object": studentObject.packStudentObject()
        }
    elif (int(pdf_type) == 1 or int(pdf_type) == 3):
     data_dict = {
        "Name of Student": studentObject.name,
        "Student ID Number": studentObject.studentId,
        "Semester Admitted to Program": studentObject.dates['admitted'],
        "Graduation": studentObject.dates['expected_graduation'],
        "ct1": coreName[0],
        "cn1": coreNum[0],
        "coreSem1": coreSem[0],
        "coreTransfer1": coreTransfer[0],
        "coreGrade1": coreGrade[0],
        "ct2": coreName[1],
        "cn2": coreNum[1],
        "coreSem2": coreSem[1],
        "coreTransfer2": coreTransfer[1],
        "coreGrade2": coreGrade[1],
        "ct3": coreName[2],
        "cn3": coreNum[2],
        "coreSem3": coreSem[2],
        "coreTransfer3": coreTransfer[2],
        "coreGrade3": coreGrade[2],
        "ct4": coreName[3],
        "cn4": coreNum[3],
        "coreSem4": coreSem[3],
        "coreTransfer4": coreTransfer[3],
        "coreGrade4": coreGrade[3],
        "ct5": coreName[4],
        "cn5": coreNum[4],
        "coreSem5": coreSem[4],
        "coreTransfer5": coreTransfer[4],
        "coreGrade5": coreGrade[4],
        "OtherReq1": "",
        "ct20": "",
        "cn20": "",
        "sem20": "",
        "transfer20": "",
        "grade20": "",
        "OtherReq2": "",
        "ct21": "",
        "cn21": "",
        "sem21": "",
        "transfer21": "",
        "grade21": "",
        "ct22": prereqName[0],
        "cn22": prereqNum[0],
        "sem22": prereqSem[0],
        "transfer22": prereqWaiver[0],
        "grade22": prereqGrade[0],
        "ct23": prereqName[1],
        "cn23": prereqNum[1],
        "sem23": prereqSem[1],
        "transfer23": prereqWaiver[1],
        "grade23": prereqGrade[1],
        "ct24": prereqName[2],
        "cn24": prereqNum[2],
        "sem24": prereqSem[2],
        "transfer24": prereqWaiver[2],
        "grade24": prereqGrade[2],
        "ct25": prereqName[3],
        "cn25": prereqNum[3],
        "sem25": prereqSem[3],
        "transfer25": prereqWaiver[3],
        "grade25": prereqGrade[3],
        "ct26": prereqName[4],
        "cn26": prereqNum[4],
        "sem26": prereqSem[4],
        "transfer26": prereqWaiver[4],
        "grade26": prereqGrade[4],
        "ct27": prereqName[5],
        "cn27": prereqNum[5],
        "sem27": prereqSem[5],
        "transfer27": prereqWaiver[5],
        "grade27": prereqGrade[5],
        "ct28": prereqName[6],
        "cn28": prereqNum[6],
        "sem28": prereqSem[6],
        "transfer28": prereqWaiver[6],
        "grade28": prereqGrade[6],
        "ct29": prereqName[7],
        "cn29": prereqNum[7],
        "sem29": prereqSem[7],
        "transfer29": prereqWaiver[7],
        "grade29": prereqGrade[7],
        "Academic Advisor": "",
        "Date Submitted": "",
        "ct6": followingName[0],
        "ct7": followingName[1],
        "ct8": followingName[2],
        "ct9": followingName[3],
        "ct10": followingName[4],
        "ct11": followingName[5],
        "cn6": followingNum[0],
        "cn7": followingNum[1],
        "cn8": followingNum[2],
        "cn9": followingNum[3],
        "cn10": followingNum[4],
        "cn11": followingNum[5],
        "sem6": followingSem[0],
        "sem7": followingSem[1],
        "sem8": followingSem[2],
        "sem9": followingSem[3],
        "sem10": followingSem[4],
        "sem11": followingSem[5],
        "transfer6": followingTransfer[0],
        "transfer7": followingTransfer[1],
        "transfer8": followingTransfer[2],
        "transfer9": followingTransfer[3],
        "transfer10": followingTransfer[4],
        "transfer11": followingTransfer[5],
        "grade6": followingGrade[0],
        "grade7": followingGrade[1],
        "grade8": followingGrade[2],
        "grade9": followingGrade[3],
        "grade10": followingGrade[4],
        "grade11": followingGrade[5],
        "grade12": electiveGrade[0],
        "grade13": electiveGrade[1],
        "grade14": electiveGrade[2],
        "grade15": electiveGrade[3],
        "grade16": electiveGrade[4],
        "grade17": addElectiveGrade[0],
        "grade18": addElectiveGrade[1],
        "grade19": addElectiveGrade[2],
        "cn12": electiveNum[0],
        "cn13": electiveNum[1],
        "cn14": electiveNum[2],
        "cn15": electiveNum[3],
        "cn16": electiveNum[4],
        "cn17": addElectiveNum[0],
        "cn18": addElectiveNum[1],
        "cn19": addElectiveNum[2],
        "ct12": electiveName[0],
        "ct13": electiveName[1],
        "ct14": electiveName[2],
        "ct15": electiveName[3],
        "ct16": electiveName[4],
        "ct17": addElectiveName[0],
        "ct18": addElectiveName[1],
        "ct19": addElectiveName[2],
        "sem12": electiveSem[0],
        "sem13": electiveSem[1],
        "sem14": electiveSem[2],
        "sem15": electiveSem[3],
        "sem16": electiveSem[4],
        "sem17": addElectiveSem[0],
        "sem18": addElectiveSem[1],
        "sem19": addElectiveSem[2],
        "transfer12": electiveTransfer[0],
        "transfer13": electiveTransfer[1],
        "transfer14": electiveTransfer[2],
        "transfer15": electiveTransfer[3],
        "transfer16": electiveTransfer[4],
        "transfer17": addElectiveTransfer[0],
        "transfer18": addElectiveTransfer[1],
        "transfer19": addElectiveTransfer[2],
        "fastTrack": isFT,
        "thesis": isThesis,
        "object": studentObject.packStudentObject()
      }
    else:
        raise Exception("Error:PDF Type not valid")

    base_dev = './public/degreePlans/'
    base_prod = './build/degreePlans/'
    try:
        fillpdfs.write_fillable_pdf(base_dev + pdf_name, path, data_dict)
    except:
        fillpdfs.write_fillable_pdf(base_prod + pdf_name, path, data_dict)

def getStudentFile(name):
    return name.replace(" ", "") + '_DP' + '.pdf'
             

def makeDegreePlanMethod(studentObject):
    if (studentObject == 'mock'):
        studentObject = mockStudent()
    else:
        studentObject = json_to_student(studentObject)
    
    file_name = getStudentFile(studentObject.name)
    file_path = get_server_path() + '/' + file_name
    
    fillPDFForms(studentObject, file_path)
    return file_name


if __name__ == '__main__':
    makeDegreePlanMethod('mock')