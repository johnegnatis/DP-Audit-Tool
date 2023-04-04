import React, { useState } from "react";
import { getForm } from "../inputComponents";
import { formatGrid, getSpan } from "../gridLayout";
import { Button } from "antd";
const EditClass = ({ handleSubmit, editClassProps, handleSwapping, handleDeleteClass }) => {
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
  } = editClassProps;

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
        Submit Edits
      </Button>
      <Button className="button orange-bg" onClick={() => handleSwapping()}>
        Swap With Another Row
      </Button>
      <Button className="button red-bg" onClick={() => handleDeleteClass()}>
        Delete Class
      </Button>
    </div>
  );
};

export default EditClass;
