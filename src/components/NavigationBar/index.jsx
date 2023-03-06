import React from "react";
import { useGlobalState, setGlobalState } from "../GlobalState";

const NavigationBar = () => {
  const [students] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  return (
    <header className="navigation-bar">
      <div
        className={`plus-icon ${!!selectedId && "selected-id"}`}
        onClick={() => setGlobalState("selectedId", "")}
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
            onClick={() => setGlobalState("selectedId", studentId)}
          >
            <span>{name}</span>
          </div>
        )})}
      </nav>
      <div className="help-icon">
        <span>?</span>
      </div>
    </header>
  );
};
export default NavigationBar;
