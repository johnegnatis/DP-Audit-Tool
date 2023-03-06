import { Icon } from "@iconify/react";
import { iconNames } from "../../utils/constants";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { eel } from "../../utils/eel";
import { extractErrorMessage } from "../../utils/methods";
import { useGlobalState } from "../GlobalState";
import { getDatePicker, getForm, getRadio } from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";

const DegreePlan = (student) => {
  const [pageChangeSignal] = useGlobalState("selectedId");
  const defaults = {
    name: student.student.name,
    studentId: student.student.studentId,
    admitted:
      (student.student.dates &&
        dayjs(student.student.dates.semesterAdmitted)) ||
      "",
    graduation:
      (student.student.dates &&
        dayjs(student.student.dates.expectedGraduation)) ||
      "",
    fastTrack:
      (student.student.options && student.student.options.fastTrack) || false,
    thesis:
      (student.student.options && student.student.options.thesis) || false,
  };

  const [name, setName] = useState(defaults.name);
  const [studentId, setStudentId] = useState(defaults.studentId);
  const [admittedDate, setAdmittedDate] = useState(defaults.admitted);
  const [graduationDate, setGraduationDate] = useState(defaults.graduation);
  const [fastTrack, setFastTrack] = useState(defaults.fastTrack);
  const [thesis, setThesis] = useState(defaults.thesis);

  const resetState = () => {
    setName(defaults.name);
    setStudentId(defaults.studentId);
    setAdmittedDate(defaults.admitted);
    setGraduationDate(defaults.graduation);
    setFastTrack(defaults.fastTrack);
    setThesis(defaults.thesis);
  };

  useEffect(() => {
    resetState();
  }, [pageChangeSignal]);

  const fullLayout = [
    { cell_one: getSpan("Name"), cell_two: getForm(name, setName) },
    {
      cell_one: getSpan("Student ID"),
      cell_two: getForm(studentId, setStudentId),
    },
  ];
  const halfLayout = [
    {
      cell_one: getSpan("Semester Admitted"),
      cell_two: getDatePicker(admittedDate, setAdmittedDate),
      cell_three: getSpan("Anticipated Graduation"),
      cell_four: getDatePicker(graduationDate, setGraduationDate),
    },
    {
      cell_one: getSpan("Fast Track"),
      cell_two: getRadio(fastTrack, setFastTrack),
      cell_three: getSpan("Thesis"),
      cell_four: getRadio(thesis, setThesis),
    },
  ];

  return (
    <div className="degree-plan-root">
      <div className="degree-plan">
        <h1 className="title">Degree Plan</h1>
        <div className="general-info">
        <h2 className="subtitle">General Information</h2>
          {formatGrid(fullLayout, 5, 19)}
          {formatHalfGrid(halfLayout, 5, 7)}
        </div>
        <div className="core-courses">
          <h2 className="subtitle">Core Courses</h2>
          <h3 className="course-info">15 credit Hours / 3.19 grade point required (HARDCODED)</h3>
        </div>
      </div>
    </div>
  );
};

export default DegreePlan;
