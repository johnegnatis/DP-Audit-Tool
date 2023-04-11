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
    types = ['core', 'following', 'electives', 'prerequisites', 'unsure', '']  
    try:
        return types.index(obj.type)
    except ValueError:
        return types.index('')

# TODO: test on class ID, not on name
def find_add_classes(newClasses, classList, typeList, typeKey):

    # TODO: NIYA: change the test_strings method to check classList[i].number, typeList[j]['id']
    #              - Make sure to format the string so the test does not fail i.e. remove spaces,
    #               anything that is not number or letter. make all letters uppercase, ext..

    found = False
    for j in range(0, len(typeList)):
        for i in range(0, len(classList)):
            found = False
            if (test_strings(classList[i].number, typeList[j]['id'])): # finds class w/i database, assigns type
                classList[i].type = typeKey
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
    coreKey = 'core'
    following = []
    followingKey = 'following'
    prerequisites = []
    prerequisiteKey = 'prerequisites'
    electiveKey = 'electives'
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

    for i in range(0, len(studentObject.classes)): # update all untyped to 'elective'
        if (test_strings(studentObject.classes[i].type, 'unsure')):
            studentObject.classes[i].type = 'electives'    

    # Combine the classes
    studentObject.classes = studentObject.classes + newClasses

    # CHANGING THE CAPITALS - electives won't be in DB
    for i in range(0, len(studentObject.classes)):
        if studentObject.classes[i].type != 'elective': # current class type != elective, find in typeList and replace
            if studentObject.classes[i].type == coreKey:
                assign_name(studentObject.classes[i], cores)
            if studentObject.classes[i].type == followingKey:
                assign_name(studentObject.classes[i], following)
            if studentObject.classes[i].type == prerequisiteKey:
                assign_name(studentObject.classes[i], prerequisites)
        else: # current class type IS an elective -> manually change
            studentObject.classes[i].name = (studentObject.classes[i].name).title()
    
    # N-OF-FOLLOWING TYPE ASSIGNMENT
    following_list = []
    for i in range(0, len(studentObject.classes)): # add all 'following' types to a new list
        if studentObject.classes[i].type == 'following':
            following_list.append(Class(studentObject.classes[i].name, studentObject.classes[i].number, studentObject.classes[i].semester, studentObject.classes[i].transfer, studentObject.classes[i].grade, studentObject.classes[i].attempted_credits, followingKey))

    following_list = sorted(following_list, key=grade_key) # sort new list
        
    following_assign(following_list, num_of_following, followingKey) # assign 'following's and 'electives

    for i in range(0, len(following_list)): # add back to studentObject.classes[]
        for j in range(0, len(studentObject.classes)):
            if studentObject.classes[j].type == followingKey and studentObject.classes[j].number == following_list[i].number:
                studentObject.classes[j] = following_list[i]
                break

    # Sorting classes
    studentObject.classes = sorted(studentObject.classes, key=grade_key)
    studentObject.classes = sorted(studentObject.classes, key=type_key)

    for i in range(0, len(studentObject.classes)):
        print(f"{studentObject.classes[i].type.ljust(15)} {studentObject.classes[i].name}")
    
    print(studentObject.packStudentObject())
    return studentObject.packStudentObject()

if __name__ == '__main__':
    designateClassesMethod('mock')
