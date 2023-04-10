import UTDLogo from "../../assets/images/utd-home-logo.png";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { iconNames, pages } from "../../utils/constants";
import React, { useCallback, useState } from "react";
import { eel } from "../../utils/eel";
import { sendError } from "../../utils/methods";
import { useGlobalState, setGlobalState } from "../GlobalState";
import { getEelResponse } from "./apiHelper";
import NavigationBar from "../NavigationBar";

const HomePage = () => {
  const [globalStudents] = useGlobalState("students");
  const [fileStudentList, setFileStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [negativeIndex, setNegativeIndex] = useState(-1);

  const handleUploadClick = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    eel
      .getFilePaths()()
      .then((fileList) => {
        if (!fileList) {
          setLoading(false);
          return;
        }
        // TODO: handle same file uploaded error
        const promises = fileList.map((file, index) =>
          getEelResponse(file, negativeIndex - index)
        );
        setNegativeIndex((num) => num - promises.length);
        Promise.all(promises).then((students) => {
          const fails = [];
          const fileStudentsToAdd = [];
          students &&
            students.forEach((studentObj, index) => {
              if (!studentObj) {
                fileStudentsToAdd.push({
                  file: fileList[index],
                  status: "error",
                  student: null,
                });
                fails.push(fileList[index]);
              } else {
                fileStudentsToAdd.push({
                  file: fileList[index],
                  status: "success",
                  student: studentObj,
                });
              }
            });
          setFileStudentList((arr) => [...fileStudentsToAdd, ...arr]);
          setLoading(false);
          if (fails.length > 0) {
            sendError(
              <div style={{ minWidth: "650px" }}>
                <h3>The following file uploads were unsuccessful:</h3>
                <ol>
                  {fails.map((filename) => {
                    const parts = filename.split("/");
                    const fileName = parts[parts.length - 1];
                    return (
                      <li style={{ textAlign: "left", fontSize: "14px" }}>
                        {fileName}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          }
        });
      });
  }, [loading, eel, negativeIndex, setLoading]);

  const handleCreateDocumentClick = () => {
    const tempStudents = fileStudentList
      .filter(
        (obj) => obj.student && obj.student !== null && obj.status !== "error"
      )
      .map((obj) => obj.student);
    setGlobalState("students", [...tempStudents, ...globalStudents]);
    console.log(tempStudents);
    if (tempStudents && tempStudents.length > 0) {
      setGlobalState("selectedId", tempStudents[0].student.studentId);
    } else {
      sendError("No PDFs were successfully parsed");
    }
  };

  const removeElement = (fileName) => {
    setFileStudentList((arr) => arr.filter((obj) => obj.file !== fileName));
  };

  const getUploadBox = () => {
    if (loading && fileStudentList.length <= 0) {
      return (
        <div onClick={handleUploadClick} className="upload-box">
          <span>Loading...</span>
        </div>
      );
    } else if (fileStudentList.length <= 0) {
      return (
        <div onClick={handleUploadClick} className="upload-box">
          <Icon icon={iconNames.file} className="icon orange medium" />
          <span className="info">Student Transcript or Degree Plan</span>
          <span className="info-subtitle">Click to Upload.</span>
        </div>
      );
    } else {
      return (
        <div className="upload-box-list">
          {fileStudentList.map((fileObj, index) => {
            const fileName =
              fileObj &&
              fileObj.file.split("/")[fileObj.file.split("/").length - 1];
            const status =
              fileObj && fileObj.status === "success" ? (
                <Icon icon={iconNames.checkbox} className="icon orange small" />
              ) : (
                <Icon icon={iconNames.redX} className="icon red small" />
              );
            return (
              <span className="file-element border" key={index}>
                {status}
                <span>{fileName}</span>
                <Icon
                  icon={iconNames.trash}
                  className="icon orange small pointer"
                  onClick={() => removeElement(fileObj.file)}
                />
              </span>
            );
          })}
          <span
            className="file-element pointer"
            key={-1}
            onClick={() => handleUploadClick()}
          >
            <Icon icon={iconNames.plus} className="icon grey small" />
            <span>Add File</span>
            <Icon icon={iconNames.checkbox} className="icon small hide" />
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="home-page-root">
        <div className="home-page">
          <div>
            <img src={UTDLogo} alt="utd logo" />
          </div>
          <div className="title">
            UTD CS/SE Graduate Advising Degree Plan and Audit Tool
          </div>
          {getUploadBox()}
        </div>
      </div>
      <footer>
        <div className="support">
          <Icon icon={iconNames.question} className="icon orange xs" />
          <span>Support</span>
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
      </footer>
    </>
  );
};

export default HomePage;
