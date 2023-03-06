import { createGlobalState } from "react-hooks-global-state";
import { pages } from "../../utils/constants";

const { setGlobalState, useGlobalState } = createGlobalState({
  // this will hold all the student object displayed on the taskbar
  students: [
    { page: pages.degreePlan, student: { name: "John Egnatis", studentId: 111, dates: { expectedGraduation: '12/01/2023', semesterAdmitted: '06/09/2020' }} },
    { page: pages.degreePlan, student: { name: "Zia Kim", studentId: 112} },
    { page: pages.degreePlan, student: { name: "Haniyyah Hamid", studentId: 113} },
    { page: pages.degreePlan, student: { name: "Jared Hightower", studentId: 114} },
    { page: pages.degreePlan, student: { name: "Areeba Nandwani", studentId: 115} },
    { page: pages.degreePlan, student: { name: "Sai Gonuguntla", studentId: 116} },
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
