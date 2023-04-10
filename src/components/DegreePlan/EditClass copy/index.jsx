import React from "react";
import { getForm } from "../Form/inputComponents";
import { getSpan } from "../Form/gridLayout";
import { Button } from "antd";
import { useEditClass } from "../../Hooks/degreePlanHooks";
import { getNumberForm } from "../Form/inputComponents";
const EditClass = ({ handleSubmit, classObj }) => {
  const {
    name,
    setName,
    number,
    setNumber,
    semester,
    setSemester,
    transfer,
    setTransfer,
    grade,
    setGrade,
  } = useEditClass(classObj);

  const onSubmitClick = () => {
    handleSubmit({
      name,
      number,
      semester,
      transfer,
      grade,
    });
  };

  return (
    <div className="class-form-root">
      <div className="row">
        {getSpan("Course Title", false, false)}
        {getForm(name, setName)}
      </div>
      <div className="row">
        {getSpan("Course Number", false, false)}
        {getForm(number, setNumber)}
      </div>
      <div className="row">
        {getSpan("UTD Semester", false, false)}
        {getNumberForm(semester, setSemester, false, true)}
      </div>
      <div className="split5050 row">
        <div>
          {getSpan("Transfer", false, false)}
          {getForm(transfer, setTransfer, false, false)}
        </div>
        <div>
          {getSpan("Grade", false, false)}
          {getForm(grade, setGrade)}
        </div>
      </div>
      <div className="button-float-right">
        <Button className="button orange-bg" onClick={() => onSubmitClick()}>
          Save
        </Button>
            </div>
      </div>
  );
};

export default EditClass;
