import { createGlobalState } from "react-hooks-global-state";
import { genericStudent, pages } from "../../utils/constants";

const startingStates = {
  genericStudent: {
    students: [
      {
        page: pages.degreePlan,
        student: genericStudent,
      },
    ],
    selectedId: genericStudent.studentId,
  },
  default: {
    students: [],
    selectedId: "",
  },
};

const { setGlobalState, useGlobalState } = createGlobalState(startingStates.default);

const getSelectedStudent = (students, selectedId) => {
  return students && students.find((studentObj) => studentObj.student.studentId === selectedId);
};

const getSelectedStudentHook = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return getSelectedStudent(students, selectedId);
};

const changePage = (studentList, student, newPage = null, previousStudentId = null, pdfName = null, isHome = false) => {
  const index =
    studentList &&
    studentList.findIndex(
      (studentObj) =>
        studentObj.student.studentId === student.student.studentId ||
        (previousStudentId && studentObj.student.studentId === previousStudentId)
    );
  if (index < 0) return;
  if (newPage) student.page = newPage;
  if (pdfName) student.student.pdfName = pdfName;
  studentList[index] = student;
  setGlobalState("students", [...studentList]);
  if(isHome) setGlobalState("selectedId", '');
  else setGlobalState("selectedId", student.student.studentId);
};

const returnToHome = () => {
  setGlobalState("selectedId", "");
};

export { changePage, useGlobalState, setGlobalState, getSelectedStudentHook, getSelectedStudent, returnToHome };
