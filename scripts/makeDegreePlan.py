from objects import Class, Student, mockStudent

def makeDegreePlanMethod(studentObject):
    # Input: studentObject (JSON)
    # Output: Degree Plan (pdf)
    if(studentObject == 'mock'):
        studentObject = mockStudent()
    print(studentObject.packStudentObject())
    # TODO: implementation
    return;

if __name__ == '__main__':
    makeDegreePlanMethod('mock')