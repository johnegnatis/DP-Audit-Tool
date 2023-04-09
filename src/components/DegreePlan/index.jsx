import React, { useEffect, useMemo, useState } from "react";
import { useStudentObject } from "./hook";
import AddClass from "./AddClass";
import Form from "./Form";
import { Button, Drawer, message } from "antd";
import { useGlobalState, changePage } from "../GlobalState";
import EditClass from "./Form/EditClass";
import { eel } from "../../utils/eel";
import { pages, tableNames } from "../../utils/constants";
import {
  sendError,
  sendSuccess,
  sendWaiting,
  sendWarning,
} from "../../utils/methods";
import NavigationBar from "../NavigationBar";

const DegreePlan = ({ student }) => {
  // student obj hooks
  const [students] = useGlobalState("students");
  const formProps = useStudentObject(student);
  const {
    searchInput,
    setSearchInput,
    getClassSetter,
    studentObjectJSON,
    track,
  } = formProps;

  // add class hooks
  const [addClassTable, setAddClassTable] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [classOptions, setClassOptions] = useState([]);

  // edit class hooks
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  const [selectedClassForMove, setSelectedClassForMove] = useState(null);
  const allDisabled = useMemo(
    () => !!selectedClassForMove,
    [selectedClassForMove]
  );
  const selectedRow = useMemo(() => {
    const row = selectedClassForEdit || selectedClassForMove;
    if (!row) return null;

    return { index: row.index, table: row.class.type };
  });

  const generatePDF = () => {
    eel
      .makeDegreePlan(studentObjectJSON)()
      .then((pdfName) => {
        navigatePage(pages.pdfPreview, pdfName);
      })
      .catch((e) => console.log(e, "error at PDF creation"));

    // handle this async
  };
  const handleSelectTrack = () => {
    const newStudent = student;
    newStudent.track = track;
    eel
      .designateClasses(newStudent)()
      .then((result) => {
        console.log(result);
      })
      .catch((e) => console.log(e, "error at track selection"));
  };
  const navigatePage = (page, pdfName = null) => {
    const newStudent = {
      student: studentObjectJSON,
      page,
    };
    changePage(students, newStudent, page, student.studentId, pdfName);
  };
  const saveStudentObject = () => {
    navigatePage(pages.degreePlan);
  };

  const handleAddClassDrawerOpen = (type, options) => {
    setAddClassTable(type);
    setIsSearch(options && options.length > 0); // if there are options, start with searching options
    setClassOptions(options);
  };
  const handleSubmitAddClass = (obj) => {
    obj.type = addClassTable;
    const setter = getClassSetter(addClassTable);
    if (!setter) return;
    setter((prev) => {
      return [...prev, obj];
    });
    setAddClassTable("");
    setClassOptions([]);
    setIsSearch(false);
    sendSuccess("Course Was Added Successfully!");
  };
  const handleSubmitEdits = (obj) => {
    obj.type = selectedClassForEdit.class.type;
    const setter = getClassSetter(selectedClassForEdit.class.type);
    if (!setter) return;
    setter((prev) => {
      const newList = [...prev];
      newList[selectedClassForEdit.index] = obj;
      return newList;
    });
    sendSuccess("Course Was Edited Successfully!");
    setSelectedClassForEdit("");
  };
  // When the first class has been selected for moving
  const moveKey = "move-message";
  const handleMovingStart = (obj) => {
    sendWaiting(
      <div>
        <p>Select a location to move this course:</p>
        {obj && obj.class && <p>{obj.class.name}</p>}
        <Button
          className="red-bg button"
          onClick={() => {
            setSelectedClassForMove("");
            message.destroy(moveKey);
          }}
        >
          Cancel
        </Button>
      </div>,
      moveKey
    );
    setSelectedClassForMove(obj);
  };
  // When the second class has been selected for moving
  const handleMoveClick = (obj) => {
    const moveOne = selectedClassForMove;
    const moveTwo = obj;

    const moveOneSetter = getClassSetter(moveOne.class.type);
    const moveTwoSetter = getClassSetter(moveTwo.class.type);
    if (!moveOneSetter || !moveTwoSetter) {
      sendError("Move Unsuccessful", moveKey);
      setSelectedClassForMove("");
      return;
    }

    // give moveOne the targets type
    let moveOccurInSameTable = true;
    if (moveOne.class.type !== moveTwo.class.type) {
      moveOne.class.type = moveTwo.class.type;
      moveOccurInSameTable = false;
    }

    if (moveOccurInSameTable && moveOne.index === moveTwo.index) {
      sendWarning("You tried to move to the same location", moveKey);
      setSelectedClassForMove("");
      return;
    } // no move can occur here

    // insert move1 right below move2
    if (!moveOccurInSameTable) {
      moveTwoSetter((prev) => {
        let i;
        const newArray = [];
        for (i = 0; i < prev.length; i++) {
          newArray.push(prev[i]);
          if (i === moveTwo.index) {
            newArray.push(moveOne.class);
          }
        }
        return newArray;
      });
      moveOneSetter((prev) => {
        let i;
        const newArray = [];
        for (i = 0; i < prev.length; i++) {
          if (i === moveOne.index) {
            continue;
          }
          newArray.push(prev[i]);
        }
        return newArray;
      });
    } else {
      moveOneSetter((prev) => {
        let i;
        const newArray = [];
        for (i = 0; i < prev.length; i++) {
          if (i === moveOne.index) {
            continue;
          }
          newArray.push(prev[i]);
          if (i === moveTwo.index) {
            newArray.push(moveOne.class);
          }
        }
        return newArray;
      });
    }
    setSelectedClassForMove("");
    sendSuccess("Move Successful!", moveKey);
  };
  // If you click on header, move to top of row
  const handleMoveToTopClick = (type) => {
    const moveOne = selectedClassForMove;
    const moveTwoType = type;

    const moveOneSetter = getClassSetter(moveOne.class.type);
    const moveTwoSetter = getClassSetter(moveTwoType);
    if (!moveOneSetter || !moveTwoSetter) {
      sendError("Move Unsuccessful", moveKey);
      setSelectedClassForMove("");
      return;
    }

    // give moveOne the targets type
    let moveOccurInSameTable = true;
    if (moveOne.class.type !== moveTwoType) {
      moveOne.class.type = type;
      moveOccurInSameTable = false;
    }

    if (moveOccurInSameTable && moveOne.index === 0) {
      sendWarning("You tried to move to the same location", moveKey);
      setSelectedClassForMove("");
      return;
    } // no move can occur here

    moveOneSetter((prev) => {
      return [...prev].filter((_, index) => index !== moveOne.index);
    });
    moveTwoSetter((prev) => {
      return [moveOne.class, ...prev];
    });
    setSelectedClassForMove("");
    sendSuccess("Move Successful!", moveKey);
  };
  const handleDeleteClass = (obj) => {
    const setter = getClassSetter(obj.class.type);
    if (!setter) return;
    setter((prev) => {
      return prev.filter((_, index) => index !== obj.index);
    });
  };

  return (
    <>
      <NavigationBar saveStudentObject={saveStudentObject} />
      <div className={`degree-plan-root ${allDisabled ? "moving" : ""}`}>
        <Form
          allDisabled={allDisabled}
          props={formProps}
          setAddClassDrawerOpen={handleAddClassDrawerOpen}
          generatePDF={generatePDF}
          setClassForEdit={setSelectedClassForEdit}
          setClassForMove={handleMovingStart}
          handleMoveClick={handleMoveClick}
          handleMoveToTopClick={handleMoveToTopClick}
          deleteClass={handleDeleteClass}
          selectedRow={selectedRow}
          handleSelectTrack={handleSelectTrack}
        />
        <Drawer
          title={`Add ${tableNames[addClassTable] || "Course"}`}
          open={!!addClassTable}
          onClose={() => setAddClassTable("")}
        >
          <AddClass
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            classes={classOptions}
            handleSubmitAddClass={handleSubmitAddClass}
          />
        </Drawer>
        <Drawer
          title="Edit Course"
          open={!!selectedClassForEdit}
          onClose={() => setSelectedClassForEdit("")}
          className="class-form-root"
        >
          <EditClass
            classObj={selectedClassForEdit}
            handleSubmit={handleSubmitEdits}
          />
        </Drawer>
      </div>
    </>
  );
};

export default DegreePlan;
