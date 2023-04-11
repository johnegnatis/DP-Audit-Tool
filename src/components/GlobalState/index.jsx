import { createGlobalState } from "react-hooks-global-state";
import { genericStudent, pages } from "../../utils/constants";

const genericStudentState = {
  students: [
    {
      page: pages.degreePlan,
      student: genericStudent,
    },
  ],
  selectedId: genericStudent.studentId,
};
const defaultStartingState = {
  students: [],
  selectedId: '',
}

const { setGlobalState, useGlobalState } = createGlobalState(genericStudentState);

const getSelectedStudent = (students, selectedId) => {
  return students && students.find((studentObj) => studentObj.student.studentId === selectedId);
};

const getSelectedStudentHook = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return getSelectedStudent(students, selectedId);
};

const changePage = (studentList, student, newPage, previousStudentId = null, pdfName = null) => {
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
  setGlobalState("selectedId", student.student.studentId);
};

export { changePage, useGlobalState, setGlobalState, getSelectedStudentHook, getSelectedStudent };
