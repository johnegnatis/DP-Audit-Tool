try:
    from scripts.objects import Class, Student, mockStudent
except:
    from objects import Class, Student, mockStudent
    
def designateClassesMethod(studentObject, track):
    if (studentObject == 'mock'):
        studentObject = mockStudent(unsure=True)

    print(studentObject.packStudentObject())

    # studentObject has a list of classes that are all type: 'unsure'
    # This function needs to designate each class to the table it belongs, which
    # will depend on the track parameter.

    # Steps:
    # 1. Read the database for the core, following, and prerequisites defaults
    # 2. For each class in the student object, decide which table it belongs to (core, following, elective, or prerequisites)
    #       - set the 'type' property appropriately
    # 3. Fill in the core, following, and prerequisites appropriately, even if the student has yet to take them
    # 4. Sort by GPA (highest to lowest) and by table order (core -> following -> elective -> prerequisites)
    # 5. Return studentObject

if __name__ == '__main__':
    designateClassesMethod('mock')
