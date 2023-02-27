import React from "react";
import { useGlobalState, setGlobalState } from "../GlobalState";

const NavigationBar = () => {
  const [students] = useGlobalState("students");
  const [selected] = useGlobalState("selected");

  return (
    <header className="navigation-bar">
      <div
        className={`plus-icon ${!!selected && "selected"}`}
        onClick={() => setGlobalState("selected", "")}
      >
        <span>+</span>
      </div>
      <nav>
        {students.map((student, index) => (
          <div
            className={`${selected === student && "selected"}`}
            key={index}
            onClick={() => setGlobalState("selected", student)}
          >
            <span>{student}</span>
          </div>
        ))}
      </nav>
      <div className="help-icon">
        <span>?</span>
      </div>
    </header>
  );
};
export default NavigationBar;
