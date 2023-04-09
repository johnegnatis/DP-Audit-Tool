try:
    from scripts.objects import Class, Student, mockStudent
except:
    from objects import Class, Student, mockStudent
import json
import pandas as pd
import numpy as np
    
def designateClassesMethod(studentObject):
    if (studentObject == 'mock'):
        studentObject = mockStudent(unsure=True)


    # TODO: try/except for path doesn't work, only uses local path?
    base_prod = './build/database.json/'
    base_dev = './public/database.json/'
    test_dev = '../public/database.json'
    path = open(r'C:\Users\Owner\Documents\GitHub\Senior-Project\public\database.json')

    # try:
    #     f = open(base_prod)
    # except:
    #     try:
    #         f = open(base_dev)
    #     except:
    #         f = open(test_dev)
    # data = json.load(f)
    data = json.load(path)
    
    classes = []
    track_name = ''
    cores = []
    following = []
    prereqs = []
    trackList = data['tracks']

    # EXTRACTING CORRECT TRACK FROM DB
    for track in range(len(trackList)):
        if (trackList[track]['name'] == studentObject.track):
            track_name = trackList[track]['name']
            cores = trackList[track]['core'] 
            following = trackList[track]['following']
            prereqs = trackList[track]['prerequisites']



    # UPDATING STUDENT'S CLASS TYPES 
    for i in range(0, len(studentObject.classes)): # TODO: NOT ASSIGNING FIRST INDEX OR LAST? WHY...
        for j in range(0, len(cores)):
            if (studentObject.classes[i].name == cores[j]['name']):
                # print("core found")
                studentObject.classes[i].type = 'core'
        for j in range(0, len(following)):
            if (studentObject.classes[i].name == following[j]['name']):
                # print("following found")
                studentObject.classes[i].type = 'following'
        for j in range(0, len(prereqs)):
            if (studentObject.classes[i].name == prereqs[j]['name']):
                # print("prereq found")
                studentObject.classes[i].type = 'prerequisites'
    
    for i in range(0, len(studentObject.classes)):
        if(studentObject.classes[i].type == 'unsure'):
            studentObject.classes[i].type = 'electives'

    # for i in range(0, len(studentObject.classes)):
    #     print(studentObject.classes[i].name + "\t\t\t" +  studentObject.classes[i].type)



    # SORTING CLASSES[] : core, following, elective, prereq..... highest gpa to lowest
    # numpy arrays created to initialize dataframe for sorting
    arr1, arr2, arr3, arr4, arr5, arr6, arr7 = [], [], [], [], [], [], []
    for i in range(len(studentObject.classes)):
        arr1.append(studentObject.classes[i].name)
        arr2.append(studentObject.classes[i].number)
        arr3.append(studentObject.classes[i].semester)
        arr4.append(studentObject.classes[i].transfer)
        arr5.append(studentObject.classes[i].grade)
        arr6.append(studentObject.classes[i].attempted_credits)
        arr7.append(studentObject.classes[i].type)
    array1, array2, array3, array4 = np.array(arr1), np.array(arr2), np.array(arr3), np.array(arr4)
    array5, array6, array7 = np.array(arr5), np.array(arr6), np.array(arr7)

    df = pd.DataFrame()
    df.insert(0, "name", array1)
    df.insert(1, "number", array2)
    df.insert(2, "semester", array3)
    df.insert(3, "transfer", array4)
    df.insert(4, "grade", array5)
    df.insert(5, "attempted_credits", array6)
    df.insert(6, "type", array7)

    # NOTE: classes without a grade are listed at top of lists
    df = df.sort_values(["type", "grade"]) 
    # print(df)



    # UPDATING CLASSES[] + RETURNING OBJECT
    df = df.values.tolist()
    for i in range(len(df)):
        myClass = Class(df[i][0], df[i][1], df[i][2], df[i][3], df[i][4], df[i][5], df[i][6]) 
        classes.append(myClass)
    studentObject.classes = classes
    for i in range(0, len(studentObject.classes)):
        print(studentObject.classes[i].name + "\t\t\t" +  studentObject.classes[i].type)
    return studentObject.packStudentObject()
    

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

if __name__ == '__main__':
    designateClassesMethod('mock')
