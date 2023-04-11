try:
    from scripts.objects import Class, Student, mockStudent, json_to_student
    from scripts.helpers import tree_printer
    from scripts.database import open_database
except:
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
unsureKey = 'unsure'

def test_strings(database_string, transcript_string):
    if (database_string == ''): return False
    if (transcript_string == ''): return False
    return transcript_string.lower().strip() in database_string.lower().strip()

def grade_key(obj):
    grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', ''] 
    try:
        return grades.index(obj.grade)
    except ValueError:
        return grades.index('')

def type_key(obj):
    types = [coreKey, followingKey, electiveKey, prerequisiteKey, unsureKey, '']  
    try:
        return types.index(obj.type)
    except ValueError:
        return types.index('')

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
                found = True
                break
        if not found: # student hasn't take the class yet, store as a new class to add to classes[] list later
            newClasses.append(Class(typeList[j]['name'], typeList[j]['id'],'', '', '', '', typeKey))


def designateClassesMethod(studentObject):
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

    for i in range(0, len(studentObject.classes)): # update all untyped to 'electives'
        if (test_strings(studentObject.classes[i].type, unsureKey)):
            studentObject.classes[i].type = electiveKey    

    # Combine the classes
    studentObject.classes = studentObject.classes + newClasses

    # CHANGING THE CAPITALS - electives won't be in DB
    for i in range(0, len(studentObject.classes)):
        if studentObject.classes[i].type == electiveKey: # current class type == elective, make it title case; non-electives are handled above
            studentObject.classes[i].name = (studentObject.classes[i].name).title()

    # Sorting by grade
    studentObject.classes = sorted(studentObject.classes, key=grade_key)
    
    # IF the student has completed 2 of the following courses but the track only calls for 1,  
    # then the higher grade one should stay and the lower grade one goes into electives.
    count = 0
    for classObj in studentObject.classes:
        # only for following classes that have grades
        if classObj.type != followingKey or not classObj.grade:
            continue
        
        if count >= num_of_following: # if we have surpassed the limit of following classes, this following class becomes an elective
            classObj.type = electiveKey
        elif classObj.grade:
            count = count + 1

    # Here is where to divide by additional and electives
    
    # Sorting by type
    studentObject.classes = sorted(studentObject.classes, key=type_key)

    for i in range(0, len(studentObject.classes)):
        print(f"{studentObject.classes[i].type.ljust(15)} {studentObject.classes[i].name}")
    
    print(studentObject.packStudentObject())
    return studentObject.packStudentObject()

if __name__ == '__main__':
    designateClassesMethod('mock')