import Logo from "../../assets/images/logo.png";
import { Button, Tooltip } from "antd";
import { Icon } from "@iconify/react";
import { iconNames, pages } from "../../utils/constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { eel } from "../../utils/eel";
import { handleError, sendError, sendLoading, sendSuccess } from "../../utils/methods";
import { useGlobalState, setGlobalState } from "../GlobalState";
import { getEelResponse } from "./apiHelper";
import NavigationBar from "../NavigationBar";
import SettingsForm from "./SettingsForm";
import { status, statusMessage, getStatusIcon } from "./fileStatusHelpers";

const HomePage = () => {
  const [globalStudents] = useGlobalState("students");
  const [fileStudentList, setFileStudentList] = useState([]);
  const [fileNameLoading, setFileNameLoading] = useState(false);
  const uploadLoading = fileStudentList.find((obj) => obj.status === status.loading);
  const allLoading = useMemo(() => fileNameLoading || uploadLoading, [fileNameLoading, uploadLoading]);
  const key = "popup-upload";
  const split = "(A+D++_WD*A_>";

  const handleUploadClick = useCallback(() => {
    if (allLoading) {
      return;
    }
    setFileNameLoading(true);
    sendLoading("Selecting Files", key);
    eel
      .getFilePaths()()
      .then((fileList) => {
        setFileNameLoading(false);
        if (!fileList || fileList.length <= 0) return;
        sendSuccess("Reading files", key);
        setFileStudentList((prev) => {
          const newStudents = fileList.map((fileName) => {
            return {
              file: fileName,
              status: status.loading,
              student: null,
            };
          });
          return [...newStudents, ...prev];
        });

        for (const file of fileList) {
          getEelResponse(file)
            .then((student) => {
              setFileStudentList((prev) => {
                const newList = [...prev];
                const index = newList.findIndex((obj) => obj.file === file);
                if (index < 0) return prev;
                if (student && student.student && student.student.studentId) {
                  const studentId = student.student.studentId;
                  const studentIdsToCheck = [
                    ...globalStudents.map((obj) => obj.student.studentId),
                    ...newList.map((obj) => obj.student && obj.student.student.studentId),
                  ];
                  if (studentIdsToCheck.includes(studentId)) {
                    newList[index].status = status.errorSameId;
                    newList[index].file += split + Math.random();
                  } else {
                    newList[index].student = student;
                    newList[index].status = status.success;
                  }
                } else {
                  newList[index].status = status.error;
                  newList[index].file += split + Math.random();
                }
                return newList;
              });
            })
            .catch((e) => {
              setFileStudentList((prev) => {
                const newList = [...prev];
                const index = newList.findIndex((obj) => obj.file === file);
                newList[index].status = status.error;
                newList[index].file += split + Math.random();
                return newList;
              });
            });
        }
      })
      .catch((e) => {
        console.log(e);
        handleError(e, key);
        setFileNameLoading(false);
        return;
      });
  }, [fileNameLoading, eel, setFileNameLoading, globalStudents]);

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
    return (
      <div onClick={handleUploadClick} className="upload-box">
        <Icon icon={iconNames.file} className="icon orange medium" />
        <span className="info">Student Transcript or Degree Plan</span>
        <span className="info-subtitle">Click to Upload.</span>
      </div>
    );
  };
  const getFileList = () => {
    return (
      <div className="file-list">
        {fileStudentList &&
          fileStudentList.map((fileObj, index) => {
            const fileName = fileObj && fileObj.file.split("/")[fileObj.file.split("/").length - 1].split(split)[0];
            const statusIcon = getStatusIcon(fileObj);
            const isLoadingForCSS = fileObj.status === status.loading ? "loading" : "";
            return (
              <span className={`file-element border ${isLoadingForCSS}`} key={index}>
                {statusIcon}
                <span>{fileName}</span>
                <Tooltip placement="right" title="Remove Student">
                  <Icon icon={iconNames.close} className="icon grey xs pointer" onClick={() => removeElement(fileObj.file)} />
                </Tooltip>
              </span>
            );
          })}
      </div>
    );
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const topRightIcon = <Icon icon={iconNames.settings} onClick={() => setSettingsOpen(true)} className="icon grey xs pointer" />;
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <NavigationBar topRightIcon={topRightIcon} />
      <div className="home-page-root">
        <div className="home-page">
          <div>
            <img src={Logo} alt="UTD CS/SE Graduate Advising Degree Plan and Audit Tool Logo" />
          </div>
          <div className="title">UTD CS/SE Graduate Advising Degree Plan and Audit Tool</div>
          <div className="container-upload">
            {getUploadBox()}
            {getFileList()}
          </div>
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
            disabled={allLoading || (fileStudentList && fileStudentList.length <= 0)}
          >
            Create Documents
          </Button>
        </div>
      </footer>
      <SettingsForm open={settingsOpen} onClose={() => handleCloseSettings()} />
    </>
  );
};

export default HomePage;
