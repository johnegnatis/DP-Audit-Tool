import UTDLogo from "../../assets/images/utd-home-logo.png";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { iconNames } from "../../utils/constants";
import React, { useState } from "react";
import { eel } from "../../utils/eel";
import { extractErrorMessage } from "../../utils/methods";

const HomePage = () => {
  const [studentObject, setStudentObject] = useState(); // TODO: put this in global state, nav bar uses name only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleUploadClick = () => {
    if (studentObject || loading) {
      setStudentObject();
      return;
    }
    setLoading(true);
    eel
      .getDataFromTranscript()()
      .then((result) => {
        setStudentObject(result);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.errorText && extractErrorMessage(error.errorText));
        setStudentObject();
        setLoading(false);
      });
  };
  console.log(studentObject);

  if (error) return <div>HANDLE ERROR</div> // TODO: handle error for not parsed PDF

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
            icon={!!studentObject ? iconNames.checkbox : iconNames.file}
            className="icon orange medium"
          />
          <span className="info">
            {!!studentObject
              ? "(Implement File Name Here).pdf"
              : "Student Transcript or Degree Plan"}
          </span>
          <span className="info-subtitle">
            {!!studentObject ? "Click again to remove" : "Click to Upload."}
          </span>
        </div>
        <div className="create-button">
          <Button className="button orange-bg" size="large">
            CREATE DOCUMENTS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
