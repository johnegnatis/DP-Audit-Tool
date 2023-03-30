import { createGlobalState } from "react-hooks-global-state";
import { pages } from "../../utils/constants";

const { setGlobalState, useGlobalState } = createGlobalState({
  students: [
    {
      page: pages.pdfPreview,
      student: {
        name: "Generic Student",
        studentId: 111,
        dates: {
          expectedGraduation: "12/01/2023",
          semesterAdmitted: "06/09/2020",
        },
      },
    },
  ],
  selectedId: '',
});

const getSelectedStudent = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return (
    students &&
    students.find((studentObj) => studentObj.student.studentId === selectedId)
  );
};

const changePage = (studentList, student, page) => {
  const index =
    studentList &&
    studentList.findIndex(
      (studentObj) =>
        studentObj.student.studentId === student.student.studentId
    );

  if (index < 0) return;
  studentList[index].page = page;
  setGlobalState("students", [...studentList]);
};

export {
  changePage,
  useGlobalState,
  setGlobalState,
  getSelectedStudent,
};
