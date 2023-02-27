import React from "react";
import { useGlobalState } from "../GlobalState";
import HomePage from "../HomePage";
import { pages } from "../../utils/constants";

const Router = () => {
  const [currentPage] = useGlobalState("page");
  switch (currentPage) {
    case pages.homePage:
      return <HomePage />;
    default:
      return <div>Page Not Found</div>;
  }
};

export default Router;
