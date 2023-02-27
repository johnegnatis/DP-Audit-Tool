import { createGlobalState } from "react-hooks-global-state";
import { pages } from "../../utils/constants";

const { setGlobalState, useGlobalState } = createGlobalState({
  // this will hold all the student object displayed on the taskbar
  students: [
    "John Egnatis",
    "Zia Kim",
    "Haniyyah Hamid",
    "Jared Hightower",
    "Areeba Nandwani",
    "Sai Gonuguntla",
  ],
  // TODO: eventually the students will be objects and the selected will be studentID
  selected: "",
  // page represent the routing page we are on. to switch to a different page is as simple as changing the global state
  page: pages.homePage,
});

export { useGlobalState, setGlobalState };
