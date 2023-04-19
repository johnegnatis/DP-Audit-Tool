import Logo from "../../assets/images/logo.png";
import { Button, Tooltip } from "antd";
import { Icon } from "@iconify/react";
import { iconNames, pages } from "../../utils/constants";
import React, { useCallback, useState } from "react";
import { eel } from "../../utils/eel";
import { handleError, sendError, sendLoading, sendSuccess } from "../../utils/methods";
import { useGlobalState, setGlobalState } from "../GlobalState";
import { getEelResponse } from "./apiHelper";
import NavigationBar from "../NavigationBar";
import SettingsForm from "./SettingsForm";
import SupportPage from "./SupportPage";

const HomePage = () => {
  const [globalStudents] = useGlobalState("students");
  const [fileStudentList, setFileStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [negativeIndex, setNegativeIndex] = useState(-1);
  const [isSupportPage, setIsSupportPage] = useState(true);

  const handleUploadClick = useCallback(() => {
    const key = "popup-upload";
    if (loading) {
      return;
    }
    setLoading(true);
    sendLoading("Selecting Files", key);
    eel
      .getFilePaths()()
      .then((fileList) => {
        // TODO: handle same file uploaded error
        sendLoading("Parsing Transcripts", key);
        const promises = fileList.map((file, index) => getEelResponse(file, negativeIndex - index));
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
                      <li key={fileName} style={{ textAlign: "left", fontSize: "14px" }}>
                        {fileName}
                      </li>
                    );
                  })}
                </ol>
              </div>,
              key
            );
          } else {
            sendSuccess("Transcripts parsed successfully", key);
          }
        });
      })
      .catch((e) => {
        handleError(e, key);
        setLoading(false);
      });
  }, [loading, eel, negativeIndex, setLoading]);

  const handleCreateDocumentClick = () => {
    const tempStudents = fileStudentList
      .filter((obj) => obj.student && obj.student !== null && obj.status !== "error")
      .map((obj) => obj.student);
    setGlobalState("students", [...tempStudents, ...globalStudents]);
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
            const fileName = fileObj && fileObj.file.split("/")[fileObj.file.split("/").length - 1];
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
                <Tooltip placement="right" title="Remove Student">
                  <Icon icon={iconNames.close} className="icon grey xs pointer" onClick={() => removeElement(fileObj.file)} />
                </Tooltip>
              </span>
            );
          })}
          <span className="file-element pointer" key={-1} onClick={() => handleUploadClick()}>
            <Icon icon={iconNames.plus} className="icon grey small" />
            <span>Add File</span>
            <Icon icon={iconNames.checkbox} className="icon small hide" />
          </span>
        </div>
      );
    }
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const topRightIcon = <Icon icon={iconNames.settings} onClick={() => setSettingsOpen(true)} className="icon grey xs pointer" />;
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  return !isSupportPage ? (
    <>
      <NavigationBar topRightIcon={topRightIcon} />
      <div className="home-page-root">
        <div className="home-page">
          <div>
            <img src={Logo} alt="UTD CS/SE Graduate Advising Degree Plan and Audit Tool Logo" />
          </div>
          <div className="title">UTD CS/SE Graduate Advising Degree Plan and Audit Tool</div>
          {getUploadBox()}
        </div>
      </div>
      <footer>
        <div className="support">
          <Icon icon={iconNames.question} className="icon orange xs" />
          <span onClick={() => setIsSupportPage(true)}>Support</span>
        </div>
        <div className="create-button">
          <Button
            onClick={handleCreateDocumentClick}
            className="button orange-bg"
            size="large"
            disabled={fileStudentList.length <= 0}
          >
            CREATE DOCUMENTS
          </Button>
        </div>
      </footer>
      <SettingsForm open={settingsOpen} onClose={() => handleCloseSettings()} />
    </>
  ) : (
    <>
      <NavigationBar topRightIcon={topRightIcon} />
      <SupportPage onClose={() => setIsSupportPage(false)} />
    </>
  );
};

export default HomePage;
