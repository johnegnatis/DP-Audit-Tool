import UTDLogo from "../../assets/images/utd-home-logo.png";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { iconNames, pages } from "../../utils/constants";
import React, { useState } from "react";
import { eel } from "../../utils/eel";
import { extractErrorMessage } from "../../utils/methods";
import { useGlobalState, setGlobalState } from "../GlobalState";

const HomePage = () => {
  const [globalStudents] = useGlobalState("students");

  const [tempStudents, setTempStudents] = useState([]); // TODO: put this in global state, nav bar uses name only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(-1);

  const handleUploadClick = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // eel.getFilePaths()().then((result) => { console.log(result)})
    eel
      .getDataFromTranscript()()
      .then((result) => {
        result = JSON.parse(result);
        const studentObj = {
          page: pages.degreePlan,
          student: result,
        };
        studentObj.student.studentId = studentObj.student.studentId || counter;
        setTempStudents((students) => {
          if (students) return [studentObj, ...students];
          return [studentObj];
        });
        setCounter((counter) => counter - 1);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.errorText && extractErrorMessage(error.errorText));
        setTempStudents();
        setLoading(false);
      });
  };

  const handleCreateDocumentClick = () => {
    setGlobalState('students', [...tempStudents, ...globalStudents]);
    if (tempStudents && tempStudents.length > 0 && tempStudents[0].student && tempStudents[0].student.studentId) {
      setGlobalState('selectedId', tempStudents[0].student.studentId);
    } 
  };
  if (error) return <div>HANDLE ERROR</div>; // TODO: handle error for not parsed PDF

  return (
    <div className="home-page-root">
      <div className="home-page">
        <div>
          <img src={UTDLogo} alt="utd logo" />
        </div>
        <div className="title">
          UTD CS/SE Graduate Advising Degree Plan and Audit Tool
        </div>
        <div onClick={handleUploadClick} className={`upload-box`}>
          <Icon
            icon={!!false ? iconNames.checkbox : iconNames.file}
            className="icon orange medium"
          />
          <span className="info">
            {!!false
              ? "(Implement File Name Here).pdf"
              : "Student Transcript or Degree Plan"}
          </span>
          <span className="info-subtitle">
            {!!false ? "Click again to remove" : "Click to Upload."}
          </span>
        </div>
        <div className="create-button">
          <Button
            onClick={handleCreateDocumentClick}
            className="button orange-bg"
            size="large"
          >
            CREATE DOCUMENTS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
