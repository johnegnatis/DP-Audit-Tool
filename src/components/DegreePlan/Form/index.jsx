import { getNumberForm, getForm, getRadio } from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";
import { Button } from "antd";
import { numberToStringDict, tableTypes } from "../../../utils/constants";
import ClassTable from "./Table";
import SelectTrack from "../TrackForm";
import { useState, useMemo } from "react";

const Form = ({
  classOptions,
  allDisabled,
  props,
  setAddClassDrawerOpen,
  generatePDF,
  setClassForEdit,
  setClassForMove,
  handleMoveClick,
  deleteClass,
  selectedRow,
  handleMoveToTopClick,
  handleSelectTrack,
  handleLevelingChange,
  trackOptions,
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
    elective: electives,
    prerequisites,
  } = props;
  const { coreOptions, followingOptions, prerequisiteOptions, nOfTheFollowing, tableCounts } = classOptions;
  const {
    core: coreTableSize,
    following: followingTableSize,
    electives: electiveTableSize,
    prerequisites: prerequisiteTableSize,
  } = tableCounts;
  const tableTooBigWarning = useMemo(
    () =>
      coreTableSize - core.length < 0 ||
      electiveTableSize - electives.length < 0 ||
      followingTableSize - following.length < 0 ||
      prerequisiteTableSize - prerequisites.length < 0,
    [
      core.length,
      coreTableSize,
      following.length,
      followingTableSize,
      electives.length,
      electiveTableSize,
      prerequisites.length,
      prerequisiteTableSize,
    ]
  );
  const disableSubmitButton = !(track && name && studentId && admittedDate && graduationDate) && false;
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
    handleSelectTrack();
    setTrackFormOpen(false);
  };

  const sharedTableDependencies = [
    tableTypes,
    allDisabled,
    selectedRow,
    setAddClassDrawerOpen,
    setClassForEdit,
    setClassForMove,
    handleMoveClick,
    handleMoveToTopClick,
    deleteClass,
    handleLevelingChange,
  ];
  const coreTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.core}
        title="Core Courses"
        allDisabled={allDisabled}
        classes={core}
        openAddClassDrawer={() => setAddClassDrawerOpen(tableTypes.core, coreOptions)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        deleteClass={deleteClass}
        selectedRow={selectedRow}
        size={coreTableSize}
      />
    ),
    [core, coreOptions, coreTableSize, ...sharedTableDependencies]
  );
  const followingTable = useMemo(
    () =>
      nOfTheFollowing > 0 && (
        <ClassTable
          type={tableTypes.following}
          title={`${numberToStringDict[nOfTheFollowing]} of the Following Courses`}
          subtitle=""
          allDisabled={allDisabled}
          classes={following}
          openAddClassDrawer={() => setAddClassDrawerOpen(tableTypes.following, followingOptions)}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          handleMoveToTopClick={handleMoveToTopClick}
          deleteClass={deleteClass}
          selectedRow={selectedRow}
          size={followingTableSize}
        />
      ),
    [following, followingOptions, followingTableSize, nOfTheFollowing, ...sharedTableDependencies]
  );
  const electivesTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.electives}
        title="Approved 6000 Level Courses"
        subtitle=""
        allDisabled={allDisabled}
        classes={electives}
        openAddClassDrawer={() => setAddClassDrawerOpen(tableTypes.electives, [])}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        selectedRow={selectedRow}
        deleteClass={deleteClass}
        size={electiveTableSize}
      />
    ),
    [electives, electiveTableSize, ...sharedTableDependencies]
  );
  const prerequisiteTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.prerequisites}
        title="Prerequisites"
        subtitle=""
        allDisabled={allDisabled}
        classes={prerequisites}
        openAddClassDrawer={() => setAddClassDrawerOpen(tableTypes.prerequisites, prerequisiteOptions)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        deleteClass={deleteClass}
        selectedRow={selectedRow}
        onLevelingChange={handleLevelingChange}
        size={prerequisiteTableSize}
      />
    ),
    [prerequisites, prerequisiteTableSize, prerequisiteOptions, ...sharedTableDependencies]
  );

  return (
    <div className="degree-plan">
      <SelectTrack
        track={track}
        setTrack={setTrack}
        handleConfirmTrack={handleConfirmTrack}
        open={trackFormOpen}
        options={trackOptions}
      />
      <h1 className="title">Degree Plan</h1>
      <div className="general-info">
        <h2 className="subtitle">General Information</h2>
        {formatGrid(fullLayout, 5, 19)}
        {formatHalfGrid(halfLayout, 5, 5, 9, 5)}
        {coreTable}
        {followingTable}
        {electivesTable}
        {prerequisiteTable}
      </div>
      <div>
        <div className="generate-button">
          <Button onClick={generatePDF} className="button orange-bg" size="large" disabled={allDisabled || disableSubmitButton}>
            Preview Degree Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form;
