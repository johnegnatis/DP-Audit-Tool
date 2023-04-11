import { eel } from "../../utils/eel";
import { pages } from "../../utils/constants";

export const getEelResponse = (filePath, index) => {
  return eel
    .getDataFromTranscript(filePath)()
    .then((result) => {
      if (!result) return undefined;
      const studentObj = {
        page: pages.degreePlan,
        student: JSON.parse(result),
      };
      studentObj.student.studentId = studentObj.student.studentId || index;
      return studentObj;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
};
