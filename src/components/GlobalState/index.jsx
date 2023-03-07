import { createGlobalState } from "react-hooks-global-state";
import { pages } from "../../utils/constants";

const { setGlobalState, useGlobalState } = createGlobalState({
  // this will hold all the student object displayed on the taskbar
  students: [
    { page: pages.degreePlan, student: { name: "Generic Student", studentId: 111, dates: { expectedGraduation: '12/01/2023', semesterAdmitted: '06/09/2020' }} },
  ],
  selectedId: '',
  // page represent the routing page we are on. to switch to a different page is as simple as changing the global state
});

const getSelectedStudent = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return students && students.find((studentObj) => studentObj.student.studentId === selectedId)
}

const updateSelectedStudent = (newStudent) => {
  const [students] = useGlobalState("students");
  const index = students && students.findIndex((studentObj) => studentObj.student.studentId === newStudent.student.studentId);
  
  if (index < 0) return;
  
  students[index] = {...newStudent};
  setGlobalState("students", students)
}

export { useGlobalState, setGlobalState, getSelectedStudent, updateSelectedStudent};
