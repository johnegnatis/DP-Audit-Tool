import { eel } from "../../utils/eel";
import { pages } from "../../utils/constants";

export const getEelResponse = (filePath, index) => {
    return eel
      .getDataFromTranscript(filePath)()
      .then((result) => {
        const studentObj = {
          page: pages.degreePlan,
          student: JSON.parse(result),
        };
        studentObj.student.studentId = studentObj.student.studentId || index;
        return studentObj;
      })
      .catch((error) => {
        // TODO: add error handling to method
        // setError(error.errorText && extractErrorMessage(error.errorText));
        return null;
      });
  };