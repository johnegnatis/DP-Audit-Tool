import React from "react";
import { getForm } from "../inputComponents";
import { getSpan } from "../gridLayout";
import { Button } from "antd";
import { useEditClass } from "../../hook";
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
    <div className="edit-student-root">
      {getSpan("NAME", false)}
      {getForm(name, setName)}
      {getSpan("NUMBER", false)}
      {getForm(number, setNumber)}
      {getSpan("SEMESTER", false)}
      {getForm(semester, setSemester, false)}
      {getSpan("TRANSFER", false)}
      {getForm(transfer, setTransfer, false)}
      {getSpan("GRADE", false)}
      {getForm(grade, setGrade)}
      <Button className="button orange-bg" onClick={() => onSubmitClick()}>
        Save
      </Button>
    </div>
  );
};

export default EditClass;
