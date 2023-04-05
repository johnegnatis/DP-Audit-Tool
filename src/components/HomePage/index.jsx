import UTDLogo from "../../assets/images/utd-home-logo.png";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { iconNames, pages } from "../../utils/constants";
import React, { useCallback, useState } from "react";
import { eel } from "../../utils/eel";
import { extractErrorMessage } from "../../utils/methods";
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
          const fileStudentsToAdd = [];
          students &&
            students.forEach((studentObj, index) => {
              if (!studentObj) {
                fileStudentsToAdd.push({
                  file: fileList[index],
                  status: "error",
                  student: null,
                });
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
        });
      });
  }, [loading, eel, negativeIndex, setLoading]);

  const handleCreateDocumentClick = () => {
    const tempStudents = fileStudentList.map((obj) => {
      if (obj.student) return obj.student;
    });
    setGlobalState("students", [...tempStudents, ...globalStudents]);
    if (
      tempStudents &&
      tempStudents.length > 0 &&
      tempStudents[0].student &&
      tempStudents[0].student.studentId
    ) {
      setGlobalState("selectedId", tempStudents[0].student.studentId);
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
                <Icon icon={iconNames.checkbox} className="icon orange small" />
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
    </>
  );
};

export default HomePage;
