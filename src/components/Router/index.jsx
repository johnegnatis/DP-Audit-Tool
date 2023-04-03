import React from "react";
import { getSelectedStudent, useGlobalState } from "../GlobalState";
import HomePage from "../HomePage";
import DegreePlan from "../DegreePlan";
import PdfPreview from "../PdfPreview";
import { pages } from "../../utils/constants";

const Router = () => {
  const student = getSelectedStudent() || null;
  const currentPage = (!!student && student.page) || pages.homePage;
  const studentId = (!!student && student.student.studentId) || 0;

  switch (currentPage) {
    case pages.homePage:
      return <HomePage />;
    case pages.degreePlan:
      return <DegreePlan key={studentId} student={student.student} />;
    case pages.pdfPreview:
      return <PdfPreview key={studentId} student={student.student} />
    case pages.notFound:
    default:
      return <div>Page Not Found</div>;
  }
};

export default Router;
