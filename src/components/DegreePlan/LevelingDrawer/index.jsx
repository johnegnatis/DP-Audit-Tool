import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { levelingOptions, levelingMap } from "../../../utils/constants";
import { getForm, getDropdown } from "../Form/inputComponents";
import { getSpan } from "../Form/gridLayout";

const LevelingDrawer = ({ handleSubmit, classObj }) => {
  const [levelingChoice, setLevelingChoice] = useState("");
  const [other, setOther] = useState("");
  useEffect(() => {
    setLevelingChoice("");
    setOther("");
  }, [classObj]);
  const levelingChoiceIsNotOther = [levelingMap.completed, levelingMap.notRequired, levelingMap.waived].includes(levelingChoice);
  const levelingChoiceIsOtherAndUserHasTyped = levelingChoice === levelingMap.other && !!other;
  const submitDisabled = !levelingChoiceIsNotOther && !levelingChoiceIsOtherAndUserHasTyped;
  const otherDisabled = levelingChoice !== levelingMap.other;

  const onSubmitClick = () => {
    if (levelingChoiceIsNotOther) {
      handleSubmit(levelingChoice);
    } else if (levelingChoiceIsOtherAndUserHasTyped) {
      handleSubmit(other);
    }
  };

  return (
    <div className="class-form-root">
      <div className="row">{getDropdown(levelingChoice, setLevelingChoice, levelingOptions, "Select")}</div>
      <div className="row">
        {getSpan("Enter Note For Leveling", !otherDisabled, true)}
        {getForm(other, setOther, otherDisabled)}
      </div>
      <Button className="button orange-bg" onClick={() => onSubmitClick()} disabled={submitDisabled}>
        Submit
      </Button>
    </div>
  );
};

export default LevelingDrawer;
