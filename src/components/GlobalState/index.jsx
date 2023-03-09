import { createGlobalState } from "react-hooks-global-state";
import { pages } from "../../utils/constants";

const { setGlobalState, useGlobalState } = createGlobalState({
  students: [
    {
      page: pages.degreePlan,
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
  selectedId: 111,
});

const getSelectedStudent = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return (
    students &&
    students.find((studentObj) => studentObj.student.studentId === selectedId)
  );
};

const updateSelectedStudent = (newStudent) => {
  const [students] = useGlobalState("students");
  const index =
    students &&
    students.findIndex(
      (studentObj) =>
        studentObj.student.studentId === newStudent.student.studentId
    );

  if (index < 0) return;

  students[index] = { ...newStudent };
  setGlobalState("students", students);
};

export {
  useGlobalState,
  setGlobalState,
  getSelectedStudent,
  updateSelectedStudent,
};
