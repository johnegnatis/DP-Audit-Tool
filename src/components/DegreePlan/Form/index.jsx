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
  disableActions,
  student,
  props,
  setDrawerOpen: setAddDrawerOpen,
  navigatePage,
  setClassForEdit,
  swapping,
  handleExecuteSwap,
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
    signature,
    setSignature,
    core,
    following,
    elective,
    prerequisites,
  } = props;
  const [trackFormOpen, setTrackFormOpen] = useState(true && !track);
  const fullLayout = [
    {
      cell_one: getSpan("Track"),
      cell_two: getForm(track, () => {}, true),
    },
    {
      cell_one: getSpan("Name"),
      cell_two: getForm(name, setName, disableActions),
    },
    {
      cell_one: getSpan("Student ID"),
      cell_two: getNumberForm(studentId, setStudentId, disableActions),
    },
  ];
  const halfLayout = [
    {
      cell_one: getSpan("Semester Admitted"),
      cell_two: getForm(admittedDate, setAdmittedDate, disableActions),
      cell_three: getSpan("Anticipated Graduation"),
      cell_four: getForm(graduationDate, setGraduationDate, disableActions),
    },
    {
      cell_one: getSpan("Fast Track"),
      cell_two: getRadio(fastTrack, setFastTrack, disableActions),
      cell_three: getSpan("Thesis"),
      cell_four: getRadio(thesis, setThesis, disableActions),
    },
  ];
  const handleConfirmTrack = () => {
    setTrackFormOpen(false);
  };
  const generatePDF = () => {
    eel
      .makeDegreePlan("mock")()
      .then((pdf) => {
        console.log("success", pdf);
      })
      .catch(() => console.log("error"));
    navigatePage(pages.pdfPreview);
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
          disableActions={disableActions}
          classes={core}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          swapping={swapping}
          executeSwap={handleExecuteSwap}
        />
        <ClassTable
          title="One of the Following Courses"
          subtitle=""
          disableActions={disableActions}
          classes={following}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          swapping={swapping}
          executeSwap={handleExecuteSwap}
        />
        <ClassTable
          title="Approved 6000 Level Courses"
          subtitle=""
          disableActions={disableActions}
          classes={elective}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          swapping={swapping}
          executeSwap={handleExecuteSwap}
        />
        <ClassTable
          title="Prerequisites"
          subtitle=""
          disableActions={disableActions}
          classes={prerequisites}
          openAddDrawer={() => openAddDrawer([])}
          setClassForEdit={setClassForEdit}
          swapping={swapping}
          executeSwap={handleExecuteSwap}
        />
        <div className="signature">
          <span>Academic Advisor Signature : </span>
          {getForm(signature, setSignature, disableActions)}
        </div>
        <div className="generate-button">
          <Button
            onClick={generatePDF}
            className="button orange-bg"
            size="large"
            disabled={disableActions}
          >
            GENERATE DEGREE PLAN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form;
