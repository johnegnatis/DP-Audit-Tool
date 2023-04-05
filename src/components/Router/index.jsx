import React, { useState, useEffect, useMemo } from "react";
import { getSelectedStudent, useGlobalState } from "../GlobalState";
import HomePage from "../HomePage";
import DegreePlan from "../DegreePlan";
import PdfPreview from "../PdfPreview";
import { pages } from "../../utils/constants";
import { eel } from "../../utils/eel";
import NavigationBar from "../NavigationBar";

const Router = () => {
  const selectedStudent = getSelectedStudent() || null;
  const currentPage =
    (!!selectedStudent && selectedStudent.page) || pages.homePage;
  const studentId =
    (!!selectedStudent && selectedStudent.student.studentId) || 0;

  const component = useMemo(() => {
    switch (currentPage) {
      case pages.homePage:
        return <HomePage />;
      case pages.degreePlan:
        return <DegreePlan key={studentId} student={selectedStudent.student}/>;
      case pages.pdfPreview:
        return <PdfPreview key={studentId} student={selectedStudent.student}/>;
      case pages.notFound:
      default:
        return <div>Page Not Found</div>;
    }
  }, [currentPage, studentId, selectedStudent]);

  return component;
};

export default Router;
