import { getNumberForm, getForm, getRadio } from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";
import { Button, Collapse } from "antd";
import { getNumberToString, iconNames, tableNames, tableTypes } from "../../../utils/constants";
import ClassTable from "./Table";
import SelectTrack from "../TrackForm";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

const Form = ({
  handleReturnToHome,
  classOptions,
  allDisabled,
  props,
  setAddClassDrawerOpen,
  generatePDF,
  setClassForEdit,
  setClassForMove,
  handleMoveClick,
  setClassForCopy,
  handleCopyClick,
  handleCopyToTopClick,
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
    additional,
    prerequisites,
  } = props;
  const {
    coreOptions,
    followingOptions,
    prerequisiteOptions,
    classes: electiveOptions,
    nOfTheFollowing,
    tableCounts,
    refetchClassList,
  } = classOptions;
  const {
    core: coreTableSize,
    following: followingTableSize,
    electives: electiveTableSize,
    additional: additionalTableSize,
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
      cell_one: getSpan("Semester Admitted",false),
      cell_two: getForm(admittedDate, setAdmittedDate, allDisabled),
      cell_three: getSpan("Anticipated Graduation", false),
      cell_four: getForm(graduationDate, setGraduationDate, allDisabled),
    },
    {
      cell_one: getSpan("Fast Track", false),
      cell_two: getRadio(fastTrack, setFastTrack, allDisabled),
      cell_three: getSpan("Thesis", false),
      cell_four: getRadio(thesis, setThesis, allDisabled),
    },
  ];
  const handleConfirmTrack = () => {
    handleSelectTrack();
    setTrackFormOpen(false);
  };
  const getAddClassButton = (type, onlyReturnMethod = false) => {
    let options = [];
    switch (type) {
      case tableTypes.core:
        options = coreOptions;
        break;
      case tableTypes.following:
        options = followingOptions;
        break;
      case tableTypes.electives:
        options = electiveOptions;
        break;
      case tableTypes.additional:
        options = electiveOptions;
        break;
      case tableTypes.prerequisites:
        options = prerequisiteOptions;
        break;
    }
    if (onlyReturnMethod) {
      return setAddClassDrawerOpen(type, options, type == tableTypes.electives || type == tableTypes.additional);
    }
    return (
      <Icon
        icon={iconNames.plus}
        className="orange small icon"
        onClick={(e) => {
          setAddClassDrawerOpen(type, options, type == tableTypes.electives || type == tableTypes.additional);
          e.stopPropagation();
        }}
      />
    );
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
    setClassForCopy,
    handleCopyClick,
    handleCopyToTopClick,
    deleteClass,
    handleLevelingChange,
    refetchClassList,
  ];
  const coreTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.core}
        title={tableNames.core}
        allDisabled={allDisabled}
        classes={core}
        openAddClassDrawer={() => getAddClassButton(tableTypes.core, true)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        setClassForCopy={setClassForCopy}
        handleCopyClick={handleCopyClick}
        handleCopyToTopClick={handleCopyToTopClick}
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
          title={`${getNumberToString(nOfTheFollowing)} of the Following Courses`}
          subtitle=""
          allDisabled={allDisabled}
          classes={following}
          openAddClassDrawer={() => getAddClassButton(tableTypes.following, true)}
          setClassForEdit={setClassForEdit}
          setClassForMove={setClassForMove}
          handleMoveClick={handleMoveClick}
          handleMoveToTopClick={handleMoveToTopClick}
          setClassForCopy={setClassForCopy}
          handleCopyClick={handleCopyClick}
          handleCopyToTopClick={handleCopyToTopClick}
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
        title={tableNames.electives}
        subtitle=""
        allDisabled={allDisabled}
        classes={electives}
        openAddClassDrawer={() => getAddClassButton(tableTypes.electives, true)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        setClassForCopy={setClassForCopy}
        handleCopyClick={handleCopyClick}
        handleCopyToTopClick={handleCopyToTopClick}
        selectedRow={selectedRow}
        deleteClass={deleteClass}
        size={electiveTableSize}
      />
    ),
    [electives, electiveOptions, electiveTableSize, ...sharedTableDependencies]
  );
  const additionalTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.additional}
        title={tableNames.additional}
        subtitle=""
        allDisabled={allDisabled}
        classes={additional}
        openAddClassDrawer={() => getAddClassButton(tableTypes.additional, true)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        setClassForCopy={setClassForCopy}
        handleCopyClick={handleCopyClick}
        handleCopyToTopClick={handleCopyToTopClick}
        selectedRow={selectedRow}
        deleteClass={deleteClass}
        size={additionalTableSize}
      />
    ),
    [additional, electiveOptions, additionalTableSize, ...sharedTableDependencies]
  );
  const prerequisiteTable = useMemo(
    () => (
      <ClassTable
        type={tableTypes.prerequisites}
        title={tableNames.prerequisites}
        subtitle=""
        allDisabled={allDisabled}
        classes={prerequisites}
        openAddClassDrawer={() => getAddClassButton(tableTypes.prerequisites, true)}
        setClassForEdit={setClassForEdit}
        setClassForMove={setClassForMove}
        handleMoveClick={handleMoveClick}
        handleMoveToTopClick={handleMoveToTopClick}
        setClassForCopy={setClassForCopy}
        handleCopyClick={handleCopyClick}
        handleCopyToTopClick={handleCopyToTopClick}
        deleteClass={deleteClass}
        selectedRow={selectedRow}
        onLevelingChange={handleLevelingChange}
        size={prerequisiteTableSize}
      />
    ),
    [prerequisites, prerequisiteTableSize, prerequisiteOptions, ...sharedTableDependencies]
  );
  const { Panel } = Collapse;
  return (
    <div className="degree-plan">
      <div className="scroll-dp">
        <SelectTrack
          studentName={name}
          track={track}
          setTrack={setTrack}
          handleConfirmTrack={handleConfirmTrack}
          open={trackFormOpen}
          options={trackOptions}
          handleReturnToHome={handleReturnToHome}
        />
        <h1 className="title">Edit Student Information</h1>
        <div className="general-info">
          <Collapse defaultActiveKey={["0", "1", "2", "3", "4", "5"]}>
            <Panel header="General Information" key="0">
              {formatGrid(fullLayout, 5, 19)}
              {formatHalfGrid(halfLayout, 5, 5, 9, 5)}
            </Panel>
            <Panel
              header={`${tableNames.core} (${core.length} courses)`}
              key="1"
              // extra={getAddClassButton(tableTypes.core)}
            >
              {coreTable}
            </Panel>
            <Panel
              header={`${getNumberToString(nOfTheFollowing)} of the Following Courses (${following.length} courses)`}
              key="2"
              // extra={getAddClassButton(tableTypes.following)}
            >
              {followingTable}
            </Panel>
            <Panel
              header={`${tableNames.electives} (${electives.length} courses)`}
              key="3"
              // extra={getAddClassButton(tableTypes.electives)}
            >
              {electivesTable}
            </Panel>
            <Panel
              header={`${tableNames.additional} (${additional.length} courses)`}
              key="4"
              // extra={getAddClassButton(tableTypes.additional)}
            >
              {additionalTable}
            </Panel>
            <Panel
              header={`${tableNames.prerequisites} (${prerequisites.length} courses)`}
              key="5"
              // extra={getAddClassButton(tableTypes.prerequisites)}
            >
              {prerequisiteTable}
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default Form;
