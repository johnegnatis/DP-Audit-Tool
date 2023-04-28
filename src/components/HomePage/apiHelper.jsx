import { eel } from "../../utils/eel";
import { pages } from "../../utils/constants";
import { handleError } from "../../utils/methods";

export const getEelResponse = (filePath) => {
  return eel
    .getDataFromTranscript(filePath)()
    .then((result) => {
      if (!result) return undefined;
      const studentObj = {
        page: pages.degreePlan,
        student: JSON.parse(result),
      };
      studentObj.student.studentId = studentObj.student.studentId || -1;
      return studentObj;
    })
    .catch((e) => {
      // handleError(e); TODO: put this back in maybe, depending if we divy up the remaining
      return undefined;
    });
};
