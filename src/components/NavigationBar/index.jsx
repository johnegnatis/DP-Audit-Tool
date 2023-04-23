import React, { useMemo, useState, useCallback } from "react";
import { iconNames, pages } from "../../utils/constants";
import { useGlobalState, setGlobalState, getSelectedStudent } from "../GlobalState";
import ConfirmCloseStudent from "./confirmCloseStudent";
import { Icon } from "@iconify/react";

const NavigationBar = ({ saveStudentObject, topRightIcon }) => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  const selectedStudent = useMemo(() => getSelectedStudent(students, selectedId), [students, selectedId]);
  const [studentForDelete, setStudentForDelete] = useState(false);
  const onRequestDeleteStudent = useCallback((e, obj) => {
    e.stopPropagation()
    setStudentForDelete(obj);
  }, [])

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
      const newStudents = [...students].filter((stud) => stud.student.studentId !== studentForDelete.studentId);
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
        message={`Are you sure you want to close ${studentForDelete && studentForDelete.name}?`}
        handleConfirmBoxResponse={handleConfirmBoxResponse}
      />
      <header className="navigation-bar">
        <div className={`plus-icon ${!!selectedId && "selected-id"}`} onClick={() => handlePageSwap("")}>
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
                onClick={(e) => handlePageSwap(studentId)}
              >
                <span>{name}</span>
                <Icon icon={iconNames.close} className="close-icon" onClick={(e) => onRequestDeleteStudent(e, { name, studentId })} />
              </div>
            );
          })}
        </nav>
        {topRightIcon && <div className="help-icon">{topRightIcon}</div>}
      </header>
    </>
  );
};
export default NavigationBar;
