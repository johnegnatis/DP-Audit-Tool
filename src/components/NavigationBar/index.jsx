import React, { useMemo, useState } from "react";
import { iconNames, pages } from "../../utils/constants";
import {
  useGlobalState,
  setGlobalState,
  getSelectedStudent,
} from "../GlobalState";
import ConfirmCloseStudent from "./confirmCloseStudent";
import { Icon } from "@iconify/react";

const NavigationBar = ({ saveStudentObject, helpButton }) => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  const selectedStudent = useMemo(
    () => getSelectedStudent(students, selectedId),
    [students, selectedId]
  );
  const [studentForDelete, setStudentForDelete] = useState(false);

  const handlePageSwap = (id) => {
    if (!selectedStudent) {
      setGlobalState("selectedId", id);
      return;
    }

    const alreadyOnStudentPage = selectedStudent.student.studentId === id;
    if (alreadyOnStudentPage || selectedStudent.page !== pages.degreePlan) {
      setGlobalState("selectedId", id);
      return;
    }
    saveStudentObject && saveStudentObject();
    setGlobalState("selectedId", id);
  };

  const handleConfirmBoxResponse = (response) => {
    if (response === "Delete") {
      const newStudents = [...students].filter(
        (stud) => stud.student.studentId !== studentForDelete.studentId
      );
      setGlobalState("students", newStudents);
      if (studentForDelete.studentId === selectedId) {
        setGlobalState("selectedId", "");
      }
    }
    setStudentForDelete(false);
  };

  return (
    <>
      <ConfirmCloseStudent
        open={!!studentForDelete}
        message={`Are you sure you want to delete ${
          studentForDelete && studentForDelete.name
        }`}
        handleConfirmBoxResponse={handleConfirmBoxResponse}
      />
      <header className="navigation-bar">
        <div
          className={`plus-icon ${!!selectedId && "selected-id"}`}
          onClick={() => handlePageSwap("")}
        >
          <span>+</span>
        </div>
        <nav>
          {students.map((studentObj, index) => {
            if (!studentObj.student) return;
            const name = studentObj.student.name;
            const studentId = studentObj.student.studentId;
            return (
              <div
                className={`${selectedId === studentId && "selected-id"}`}
                key={index}
                onClick={() => handlePageSwap(studentId)}
              >
                <span>{name}</span>
                <Icon
                  icon={iconNames.close}
                  onClick={() => setStudentForDelete({ name, studentId })}
                />
              </div>
            );
          })}
        </nav>
        {helpButton && (
          <div className="help-icon">
            <span>?</span>
          </div>
        )}
      </header>
    </>
  );
};
export default NavigationBar;
