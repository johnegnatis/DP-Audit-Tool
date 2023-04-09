try:
    from scripts.objects import Class, Student, mockStudent, json_to_student
    from scripts.helpers import tree_printer
except:
    from objects import Class, Student, mockStudent, json_to_student
    from helpers import tree_printer
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

def open_database():
    base_prod = './build/database.json'
    base_dev = './public/database.json'
    test_dev = '../public/database.json'

    try:
        f = open(base_prod)
    except:
        try:
            f = open(base_dev)
        except:
            f = open(test_dev)
    return json.load(f)

def find_add_classes(newClasses, classList, typeList, typeKey):
    for j in range(0, len(typeList)):
        for i in range(0, len(classList)):
            found = False
            if (test_strings(classList[i].name, typeList[j]['name'])):
                classList[i].type = typeKey
                found = True
                break
        if not found:
            newClasses.append(Class(typeList[j]['name'], typeList[j]['id'],'', '', '', '', typeKey))

# studentObject has a list of classes that are all type: 'unsure'
# This function needs to designate each class to the table it belongs, which
# will depend on the track parameter.

# Steps:
# 1. Read the database for the core, following, and prerequisites defaults
# 2. Fill in the core, following, and prerequisites appropriately, even if the student has yet to take them
# 3. For each class in the student object, decide which table it belongs to (core, following, elective, or prerequisites)
#       - set the 'type' property appropriately
#       - what constitutes an elective?
# 4. Sort by GPA (highest to lowest) and by table order (core -> following -> elective -> prerequisites)
# 5. Return studentObject

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

    # EXTRACTING CORRECT TRACK FROM DB
    for track in range(len(trackList)):
        if (trackList[track]['name'] == studentObject.track):
            track_name = trackList[track]['name']
            cores = trackList[track][coreKey] 
            following = trackList[track][followingKey]
            prerequisites = trackList[track][prerequisiteKey]

    # UPDATING STUDENT'S CLASS TYPES, ADD IF NOT TAKEN
    newClasses = []
    find_add_classes(newClasses, studentObject.classes, cores, coreKey)
    find_add_classes(newClasses, studentObject.classes, following, followingKey)
    find_add_classes(newClasses, studentObject.classes, prerequisites, prerequisiteKey)

    for i in range(0, len(studentObject.classes)):
        if (test_strings(studentObject.classes[i].type, 'unsure')):
            studentObject.classes[i].type = 'electives'    

    # Combine the classes
    studentObject.classes = studentObject.classes + newClasses

    # Sorting classes
    studentObject.classes = sorted(studentObject.classes, key=grade_key)
    studentObject.classes = sorted(studentObject.classes, key=type_key)

    # for i in range(0, len(studentObject.classes)):
        # print(f"{studentObject.classes[i].type.ljust(15)} {studentObject.classes[i].name}")
    # print(studentObject.packStudentObject())
    return studentObject.packStudentObject()

if __name__ == '__main__':
    designateClassesMethod('mock')

# SORTING CLASSES[] : core, following, elective, prereq..... highest gpa to lowest
    # numpy arrays created to initialize dataframe for sorting
    # arr1, arr2, arr3, arr4, arr5, arr6, arr7 = [], [], [], [], [], [], []
    # for i in range(len(studentObject.classes)):
    #     arr1.append(studentObject.classes[i].name)
    #     arr2.append(studentObject.classes[i].number)
    #     arr3.append(studentObject.classes[i].semester)
    #     arr4.append(studentObject.classes[i].transfer)
    #     arr5.append(studentObject.classes[i].grade)
    #     arr6.append(studentObject.classes[i].attempted_credits)
    #     arr7.append(studentObject.classes[i].type)
    # array1, array2, array3, array4 = np.array(arr1), np.array(arr2), np.array(arr3), np.array(arr4)
    # array5, array6, array7 = np.array(arr5), np.array(arr6), np.array(arr7)

    # df = pd.DataFrame()
    # df.insert(0, "name", array1)
    # df.insert(1, "number", array2)
    # df.insert(2, "semester", array3)
    # df.insert(3, "transfer", array4)
    # df.insert(4, "grade", array5)
    # df.insert(5, "attempted_credits", array6)
    # df.insert(6, "type", array7)

    # # NOTE: classes without a grade are listed at top of lists
    # df = df.sort_values(["grade", "type"], na_position='last') 
    # print(df)

    # UPDATING CLASSES[] + RETURNING OBJECT
    # df = df.values.tolist()
    # for i in range(len(df)):
    #     myClass = Class(df[i][0], df[i][1], df[i][2], df[i][3], df[i][4], df[i][5], df[i][6]) 
    #     classes.append(myClass)
    # studentObject.classes = classes