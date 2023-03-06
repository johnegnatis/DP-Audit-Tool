import React from "react";
import { getSelectedStudent, useGlobalState } from "../GlobalState";
import HomePage from "../HomePage";
import DegreePlan from "../DegreePlan";
import { pages } from "../../utils/constants";

const Router = () => {
  const student = getSelectedStudent() || null;
  const currentPage = !!student && student.page || pages.homePage;

  switch (currentPage) {
    case pages.homePage:
      return <HomePage />;
    case pages.degreePlan:
      return <DegreePlan student={student.student} />;
    case pages.notFound:
    default:
      return <div>Page Not Found</div>;
  }
};

export default Router;
