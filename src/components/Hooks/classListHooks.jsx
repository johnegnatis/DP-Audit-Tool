import { settingsKeys } from "../../utils/constants";
import { eel } from "../../utils/eel";
import { useState, useEffect, useCallback, useMemo } from "react";
import { handleError, sendError, sendSuccess } from "../../utils/methods";
export function useClassList(refetch) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    eel
      .classListAPI("get", [])()
      .then((result) => {
        setClasses(result);
      })
      .catch((e) => {
        handleError(e);
      });
  }, [refetch]);

  const insertClass = useCallback((classObj) => {
    eel
      .classListAPI("insert", { classObj })()
      .catch((e) => handleError(e));
  }, []);
  const updateClass = useCallback((number, classObj) => {
    eel
      .classListAPI("update", { number, classObj })()
      .catch((e) => handleError(e));
  }, []);
  const deleteClass = useCallback((number) => {
    eel
      .classListAPI("delete", { number })()
      .catch((e) => handleError(e));
  }, []);

  return { classes, insertClass, updateClass, deleteClass };
}
