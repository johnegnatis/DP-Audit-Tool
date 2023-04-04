import {
  getDatePicker,
  getNumberForm,
  getForm,
  getRadio,
} from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";
import { Button } from "antd";
import { pages, tracks } from "../../../utils/constants";
import ClassTable from "./Table";
import { eel } from "../../../utils/eel";
import SelectTrack from "../TrackForm";
import { useState } from "react";

const Form = ({
  allDisabled,
  props,
  setDrawerOpen: setAddDrawerOpen,
  generatePDF,
  setClassForEdit,
  setClassForMove,
  handleMoveClick,
  deleteClass,
}) => {
  const {
    track,
    setTrack,
    name,
    setName,
    studentId,
    setStudentId,
    admittedDate,
    setAdmittedDate,
    graduationDate,
    setGraduationDate,
    fastTrack,
    setFastTrack,
    thesis,
    setThesis,
    core,
    following,
    elective,
    prerequisites,
    pdfName,
    setPdfName,
  } = props;
  const [trackFormOpen, setTrackFormOpen] = useState(!track);
  const fullLayout = [
    {
      cell_one: getSpan("Track"),
      cell_two: getForm(track, () => {}, true),
    },
    {
      cell_one: getSpan("Name"),
      cell_two: getForm(name, setName, allDisabled),
    },
    {
      cell_one: getSpan("Student ID"),
      cell_two: getNumberForm(studentId, setStudentId, allDisabled),
    },
  ];
  const halfLayout = [
    {
      cell_one: getSpan("Semester Admitted"),
      cell_two: getForm(admittedDate, setAdmittedDate, allDisabled),
      cell_three: getSpan("Anticipated Graduation"),
      cell_four: getForm(graduationDate, setGraduationDate, allDisabled),
    },
    {
      cell_one: getSpan("Fast Track"),
      cell_two: getRadio(fastTrack, setFastTrack, allDisabled),
      cell_three: getSpan("Thesis"),
      cell_four: getRadio(thesis, setThesis, allDisabled),
    },
  ];
  const handleConfirmTrack = () => {
    setTrackFormOpen(false);
  };
  const openAddDrawer = (options) => {
    //TODO: put options based off options
    setAddDrawerOpen(true);
  };
  return (
    <div className="degree-plan">
      <SelectTrack
        track={track}
        setTrack={setTrack}
        handleConfirmTrack={handleConfirmTrack}
        open={trackFormOpen}
        options={tracks}
      />
      <h1 className="title">Degree Plan</h1>
      <div className="general-info">
        <h2 className="subtitle">General Information</h2>
        {formatGrid(fullLayout, 5, 19)}
        {formatHalfGrid(halfLayout, 5, 5, 9, 5)}
        {/* TODO: at high zooms, some text overlaps here */}
      </div>
      <div>
        <ClassTable
          title="Core Courses"
          subtitle="15 credit Hours / 3.19 grade point required (HARDCODED)"
          allDisabled={allDisabled}
          classes={core}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          deleteClass={deleteClass}
        />
        <ClassTable
          title="One of the Following Courses"
          subtitle=""
          allDisabled={allDisabled}
          classes={following}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          deleteClass={deleteClass}
        />
        <ClassTable
          title="Approved 6000 Level Courses"
          subtitle=""
          allDisabled={allDisabled}
          classes={elective}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          deleteClass={deleteClass}
        />
        <ClassTable
          title="Prerequisites"
          subtitle=""
          allDisabled={allDisabled}
          classes={prerequisites}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          deleteClass={deleteClass}
        />
        {/* <div className="signature">
          <span>Academic Advisor Signature : </span>
          {getForm(signature, setSignature, allDisabled)}
        </div> */}
        <div className="generate-button">
          <Button
            onClick={generatePDF}
            className="button orange-bg"
            size="large"
            disabled={allDisabled}
          >
            GENERATE DEGREE PLAN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form;
