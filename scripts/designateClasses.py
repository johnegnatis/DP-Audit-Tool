try:
    from scripts.objects import Class, Student, mockStudent, json_to_student
    from scripts.helpers import tree_printer
    from scripts.database import open_database
except Exception as e:
    from objects import Class, Student, mockStudent, json_to_student
    from helpers import tree_printer
    from database import open_database
import json
import pandas as pd
import numpy as np

import json
import pandas as pd
import numpy as np

coreKey = 'core'
followingKey = 'following'
prerequisiteKey = 'prerequisites'
electiveKey = 'electives'
additionalKey = 'additional'
unsureKey = 'unsure'
keysToFill = [coreKey, followingKey, prerequisiteKey]
special_topics_in_computer_science = "CS 6301"
algorithms_and_data_structures = "CS 5343"
def test_strings(database_string, transcript_string):
    if (database_string == ''): return False
    if (transcript_string == ''): return False
    return transcript_string.lower().strip() in database_string.lower().strip()

grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', ''] 
def grade_key(obj):
    try:
        return grades.index(obj.grade)
    except ValueError:
        return grades.index('')

def type_key(obj):
    types = [coreKey, followingKey, electiveKey, additionalKey, prerequisiteKey, unsureKey, '']  
    try:
        return types.index(obj.type)
    except ValueError:
        return types.index('')

# Rank prerequisites, prioritize algorithms
def is_prerequisite_higher_rank(classOne, classTwo):
    try:
        grade_one = classOne.grade.split('/')[-1]
        grade_two = classTwo.grade.split('/')[-1]
        if not grade_one:
            return False
        rank_one = grades.index(grade_one)
        rank_two = grades.index(grade_two) 
        if rank_one == rank_two:
            return classOne.number == "CS 5343" # prioritize algorithms
        return rank_one < rank_two
    except Exception as e:
        print (e)
        return False

# FINDS CLASS IN ONE OF THE TYPELISTS, CHANGES NAME
def assign_name(class_name, typeList):
    for i in range(0, len(typeList)):
        if (test_strings(class_name.number, typeList[i]['id'])): # exists in typeList, replace studentObj's name w/ typeList[name] and go back
            class_name.name = typeList[i]['name']
            break

def find_add_classes(newClasses, classList, typeList, typeKey):
    found = False
    for j in range(0, len(typeList)):
        for i in range(0, len(classList)):
            found = False
            if (test_strings(classList[i].number, typeList[j]['id'])): # finds class w/i database, assigns type
                classList[i].type = typeKey
                classList[i].name = typeList[j]['name'] # assign name from DB here
                if not test_strings(classList[i].number, special_topics_in_computer_science):
                    found = True
                break
        # student hasn't take the class yet, store as a new class to add to classes[] list later
        if (not found and typeKey in keysToFill): 
            newClasses.append(Class(typeList[j]['name'], typeList[j]['id'],'', '', '', '', typeKey))

def append_class_grade_and_semester(old_obj, new_obj):
    old_grade = old_obj.grade if old_obj.grade != '' else '?'
    old_semester = old_obj.semester if old_obj.semester != '' else '?'
    new_grade = new_obj.grade if new_obj.grade != '' else '?'
    new_semester= new_obj.semester if new_obj.grade != '' else '?'

    # if new obj doesn't have grade and semester
    if new_grade == '?' and new_semester == '?':
        return

    # if old object doesn't have anything, give new and return
    if old_grade == '?' and old_semester == '?':
        old_obj.grade = new_obj.grade
        old_obj.semester = new_obj.semester
        return

    old_obj.grade = new_grade + '/' + old_grade
    old_obj.semester =  new_semester + '/' + old_semester

def designateClassesMethod(studentObject):
    try:
        if (studentObject == 'mock'):
            studentObject = mockStudent(unsure=True)
        else:
            studentObject = json_to_student(studentObject)

        data = open_database()
        classes = []
        track_name = ''
        cores = []
        following = []
        prerequisites = []
        trackList = data['tracks']
        num_of_following = 0 

        # EXTRACTING CORRECT TRACK FROM DB
        for track in range(len(trackList)):
            if (trackList[track]['name'] == studentObject.track):
                track_name = trackList[track]['name']
                cores = trackList[track][coreKey] 
                num_of_following = trackList[track]["N-of-the-following"]
                following = trackList[track][followingKey]
                prerequisites = trackList[track][prerequisiteKey]

        # UPDATING STUDENT'S CLASS TYPES, ADD IF NOT TAKEN
        newClasses = []
        find_add_classes(newClasses, studentObject.classes, cores, coreKey)
        find_add_classes(newClasses, studentObject.classes, following, followingKey)
        find_add_classes(newClasses, studentObject.classes, prerequisites, prerequisiteKey)

        # UPDATE ALL UNTYPED TO 'ELECTIVES'
        for i in range(0, len(studentObject.classes)): 
            if (test_strings(studentObject.classes[i].type, unsureKey)):
                studentObject.classes[i].type = electiveKey    

        # COMBINE THE CLASSES, SORT BY GRADE
        studentObject.classes = studentObject.classes + newClasses
        studentObject.classes = sorted(studentObject.classes, key=grade_key)
        
        # EDGE CASES
        count = 0
        class_dict = {}
        indexes = []
        best_prerequisite_index = -1 
        for index, classObj in enumerate(studentObject.classes):

            # CHECK FOR DUPLICATES
            if classObj.number in class_dict and not test_strings(classObj.number, special_topics_in_computer_science):
                found_obj = studentObject.classes[class_dict[classObj.number]]
                append_class_grade_and_semester(found_obj, classObj)
                continue
            else:
                indexes.append(index)
                class_dict[classObj.number] = index

            # FIND THE HIGHEST GRADE PREREQUISITE, prioritize "CS 5343"
            if classObj.type == prerequisiteKey and classObj.grade:
                if best_prerequisite_index < 0 or is_prerequisite_higher_rank(classObj, studentObject.classes[best_prerequisite_index]):
                    best_prerequisite_index = index

            # TRIM FOLLOWING COURSES
            # IF the student has completed 2 of the following courses but the track only calls for 1,  
            # then the higher grade one should stay and the lower grade one goes into electives.            
            # only for following classes that have grades
            if classObj.type != followingKey or not classObj.grade:
                continue
            # if we have surpassed the limit of following classes, this following class becomes an elective
            # if CS 6301, do not put in prerequisites*
            if count >= num_of_following: 
                classObj.type = electiveKey
                continue

            if test_strings(classObj.number, special_topics_in_computer_science):
                classObj.type = electiveKey
            else:    
                count = count + 1

        # EDGE CASES PT. 2        
        studentTempList = []
        for index, classObj in enumerate(studentObject.classes):
            # put best prerequisite in additional table
            if index in indexes:
                 # CHANGING THE CAPITALS - electives won't be in DB
                if classObj.type == electiveKey: # current class type == elective, make it title case; non-electives are handled above
                    classObj.name = (classObj.name).title()
                    if test_strings(classObj.number, special_topics_in_computer_science):
                        classObj.name = classObj.name.split('[')[0]

                if index == best_prerequisite_index:
                    classObj.type = additionalKey
                studentTempList.append(classObj)
           
        # SORT BY TABLE
        studentObject.classes = sorted(studentTempList, key=type_key)
        
        # for i in range(0, len(studentObject.classes)):
            # print(f"{studentObject.classes[i].type} {studentObject.classes[i].name} {studentObject.classes[i].number} {studentObject.classes[i].grade} {studentObject.classes[i].semester}")
        return studentObject.packStudentObject()
    except Exception as e:
        print(e)
        raise Exception("Error: Error At Track Selection.")

if __name__ == '__main__':
    print(designateClassesMethod('mock'))