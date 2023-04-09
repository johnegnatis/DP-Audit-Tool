try:
    from scripts.objects import Class, Student, mockStudent
except:
    from objects import Class, Student, mockStudent
import json
    
def designateClassesMethod(studentObject):
    if (studentObject == 'mock'):
        studentObject = mockStudent(unsure=True)

    print(studentObject.packStudentObject())

    base_prod = './build/database.json/'
    base_dev = './public/database.json/'
    test_dev = '../public/database.json'
    try:
        f = open(base_prod)
    except:
        try:
            f = open(base_dev)
        except:
            f = open(test_dev)
    data = json.load(f)

    print(data["test"])
    # classes = []
    # trackList = data['tracks']
    # for track in trackList:
    #     if (track == studentObject.track):
    #         track['name']
    #         track['core'] # list of classes

    # studentObject.classes = classes
    # return studentObject.packStudentObject()
    

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
