import { settingsKeys } from "../../utils/constants";
import { eel } from "../../utils/eel";
import { useState, useEffect, useCallback, useMemo } from "react";
import { sendError, sendSuccess } from "../../utils/methods";
export function useSettings() {
  const [defaultPathForDegreePlan, setDefaultPathForDegreePlan] = useState("");
  const [defaultPathForAudit, setDefaultPathForAudit] = useState("");
  const [defaultPathForTranscripts, setDefaultPathForTranscripts] = useState("");

  const getSetter = useCallback((key) => {
    switch (key) {
      case settingsKeys.defaultPathForAudit:
        return setDefaultPathForAudit;
      case settingsKeys.defaultPathForDegreePlan:
        return setDefaultPathForDegreePlan;
      case settingsKeys.defaultPathForTranscript:
        return setDefaultPathForTranscripts;
      default:
        console.error("error at get settings setter");
    }
  }, []);
  const getDirectory = useCallback((key) => {
    const setter = getSetter(key);
    eel
      .getDirectory()()
      .then((directory) => setter(directory))
      .catch((e) => sendError(e, "Directory Select Unsuccessful"));
  }, []);
  const resetState = useCallback((key) => {
    const setter = getSetter(key);
    setter("");
  }, []);

  useEffect(() => {
    eel
      .settingAPI("get", [])()
      .then((result) => {
        setDefaultPathForTranscripts(result.find((row) => row.key === settingsKeys.defaultPathForTranscript).value);
        setDefaultPathForDegreePlan(result.find((row) => row.key === settingsKeys.defaultPathForDegreePlan).value);
        setDefaultPathForAudit(result.find((row) => row.key === settingsKeys.defaultPathForAudit).value);
      })
      .catch((e) => console.log(e, "Error with get settings"));
  }, []);

  const jsonDatabase = useMemo(
    () => [
      {
        key: settingsKeys.defaultPathForDegreePlan,
        value: defaultPathForDegreePlan,
      },
      {
        key: settingsKeys.defaultPathForAudit,
        value: defaultPathForAudit,
      },
      {
        key: settingsKeys.defaultPathForTranscript,
        value: defaultPathForTranscripts,
      },
    ],
    [defaultPathForDegreePlan, defaultPathForAudit, defaultPathForTranscripts]
  );

  const saveToSetting = useCallback((onClose) => {
    eel
      .settingAPI("save", jsonDatabase)()
      .then((response) => {
        sendSuccess("Settings Saved Successfully");
        onClose()
      })
      .catch(() => sendError("Setting Were Not Saved"));
  }, [jsonDatabase]);

  return { getDirectory, resetState, saveToSetting, defaultPathForDegreePlan, defaultPathForAudit, defaultPathForTranscripts };
}
