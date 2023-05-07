import React, { useState, useEffect, useMemo } from "react";
import { getSelectedStudentHook, useGlobalState } from "../GlobalState";
import HomePage from "../HomePage";
import DegreePlan from "../DegreePlan";
import PdfPreview from "../PdfPreview";
import { pages } from "../../utils/constants";
import { eel } from "../../utils/eel";
import NavigationBar from "../NavigationBar";
import { message } from "antd";
import { useDatabase } from "../Hooks/databaseHooks";
import { useServerPort } from "../Hooks/eelHooks";

const Router = () => {
  const selectedStudent = getSelectedStudentHook() || null;
  const currentPage = (!!selectedStudent && selectedStudent.page) || pages.homePage;
  const studentId = (!!selectedStudent && selectedStudent.student.studentId) || 0;

  const databaseProps = useDatabase();
  const { serverPort } = useServerPort();

  const component = useMemo(() => {
    switch (currentPage) {
      case pages.homePage:
        return <HomePage key={studentId} />;
      case pages.degreePlan:
        return <DegreePlan key={studentId} student={selectedStudent.student} databaseProps={databaseProps} />;
      case pages.pdfPreview:
        return <PdfPreview key={studentId} serverPort={serverPort} />;
      case pages.notFound:
      default:
        return <div>Page Not Found</div>;
    }
  }, [currentPage, studentId, selectedStudent]);

  // Removes any hanging message on page navigation
  useEffect(() => {
    message.destroy();
  }, [component]);

  return component;
};

export default Router;
