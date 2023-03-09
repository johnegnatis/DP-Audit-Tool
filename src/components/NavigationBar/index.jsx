import React, { useState } from "react";
import { pages } from "../../utils/constants";
import { useGlobalState, setGlobalState } from "../GlobalState";
import ConfirmPageSwitch from "./confirmPageSwitch";

const NavigationBar = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handlePageSwap = (id) => {
    const currentStudent = students.find(
      (studentObj) => studentObj.student.studentId === selectedId
    );
    const alreadyOnStudentPage = currentStudent.student.studentId === id;
    if (currentStudent.page === pages.degreePlan && !alreadyOnStudentPage) {
      setOpen(true);
      setSelected(id);
    } else setGlobalState("selectedId", id);
  };

  const handleConfirmBoxResponse = (response) => {
    if (response === "ok") setGlobalState("selectedId", selected);
  };

  return (
    <>
      <ConfirmPageSwitch
        open={open}
        setOpen={setOpen}
        okText="Yes"
        okType="danger"
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
              </div>
            );
          })}
        </nav>
        <div className="help-icon">
          <span>?</span>
        </div>
      </header>
    </>
  );
};
export default NavigationBar;
