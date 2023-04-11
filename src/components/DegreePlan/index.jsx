import React, { useCallback, useMemo, useState } from "react";
import LevelingDrawer from "./LevelingDrawer";
import { useStudentObject } from "../Hooks/degreePlanHooks";
import AddClass from "./AddClass";
import Form from "./Form";
import { Button, Drawer, message } from "antd";
import { useGlobalState, changePage, setGlobalState } from "../GlobalState";
import EditClass from "./EditClass";
import { eel } from "../../utils/eel";
import { pages, tableNames } from "../../utils/constants";
import { sendError, sendSuccess, sendWaiting, sendWarning } from "../../utils/methods";
import NavigationBar from "../NavigationBar";
import { useTrackOptions } from "../Hooks/databaseHooks";

const DegreePlan = ({ student, databaseProps }) => {
  // STUDENT OBJ LOGIC
  const [students] = useGlobalState("students");
  const formProps = useStudentObject(student);
  const { searchInput, setSearchInput, getClassSetter, studentObjectJSON, track, setClasses } = formProps;
  const classOptionProps = useTrackOptions(track);

  const handleSelectTrack = () => {
    const newStudent = student;
    newStudent.track = track;
    eel
      .designateClasses(newStudent)()
      .then((result) => {
        const newStudent = JSON.parse(result);
        setClasses(newStudent.classes);
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
  const generatePDF = () => {
    eel
      .makeDegreePlan(studentObjectJSON)()
      .then((pdfName) => {
        navigatePage(pages.pdfPreview, pdfName);
      })
      .catch((e) => console.log(e, "error at PDF creation"));

    // handle this async
  };
  const saveStudentObject = () => {
    navigatePage(pages.degreePlan);
  };

  // Database
  const { trackOptions } = databaseProps;

  // ADD LOGIC
  const [addClassTable, setAddClassTable] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const handleAddClassDrawerOpen = useCallback(
    (type, options) => {
      console.log(options);
      setAddClassTable(type);
      setIsSearch(options && options.length > 0); // if there are options, start with searching options
      setClassOptions(options);
    },
    [classOptionProps]
  );
  const handleSubmitAddClass = useCallback(
    (obj) => {
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
    },
    [addClassTable]
  );
  const handleAddClassDrawerClose = useCallback(() => {
    setAddClassTable("");
  }, [classOptionProps]);

  // EDIT LOGIC
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  const handleSubmitEdits = useCallback(
    (obj) => {
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
    },
    [selectedClassForEdit]
  );

  // MOVE LOGIC
  const [selectedClassForMove, setSelectedClassForMove] = useState(null);
  const moveKey = "move-message";
  // When the first class has been selected for moving
  const handleMovingStart = useCallback((obj) => {
    message.config({
      icon: null,
    });
    sendWaiting(
      <div style={{ minWidth: "25%", minHeight: "10%" }}>
        <p>Move the following course to the desired location:</p>
        {obj && obj.class && <p style={{ fontWeight: "700" }}>{obj.class.name}</p>}
        <Button
          className="orange-bg button"
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
  }, []);
  // When the second class has been selected for moving
  const handleMoveClick = useCallback(
    (obj) => {
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

      if (moveOccurInSameTable && (moveOne.index === moveTwo.index || moveOne.index === moveTwo.index + 1)) {
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
    },
    [selectedClassForMove]
  );
  // If you click on header, move to top of row
  const handleMoveToTopClick = useCallback(
    (type) => {
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
    },
    [selectedClassForMove]
  );

  // DELETE LOGIC
  const handleDeleteClass = useCallback((obj) => {
    const setter = getClassSetter(obj.class.type);
    if (!setter) return;
    setter((prev) => {
      return prev.filter((_, index) => index !== obj.index);
    });
  }, []);

  // LEVELING LOGIC
  const [selectedClassForLeveling, setSelectedClassForLeveling] = useState(null);
  const handleLevelingChange = useCallback((obj) => {
    const { checked, table, key } = obj;
    if (checked) {
      setSelectedClassForLeveling(obj);
    } else {
      const setter = getClassSetter(table);
      if (!setter) return;
      setter((prev) => {
        const newTable = [...prev];
        newTable[key].leveling = "";
        return newTable;
      });
    }
  }, []);
  const handleLevelingEntered = useCallback(
    (userInput) => {
      const { table, key } = selectedClassForLeveling;
      const setter = getClassSetter(table);
      if (!setter) return;
      setter((prev) => {
        const newTable = [...prev];
        newTable[key].leveling = userInput;
        return newTable;
      });
      setSelectedClassForLeveling("");
    },
    [selectedClassForLeveling]
  );
  // disable all forms when moving a class
  const allDisabled = useMemo(() => !!selectedClassForMove, [selectedClassForMove]);
  // when editing or moving class, highlight that row
  const selectedRow = useMemo(() => {
    const row = selectedClassForEdit || selectedClassForMove;
    if (!row) return null;

    return { index: row.index, table: row.class.type };
  });
  return (
    <>
      <NavigationBar saveStudentObject={saveStudentObject} />
      <div className={`degree-plan-root ${allDisabled ? "moving" : ""}`}>
        <Form
          classOptions={classOptionProps}
          trackOptions={trackOptions}
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
          handleLevelingChange={handleLevelingChange}
        />
        <Drawer
          title={`Add ${tableNames[addClassTable] || "Course"}`}
          open={!!addClassTable}
          onClose={() => handleAddClassDrawerClose()}
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
          <EditClass classObj={selectedClassForEdit} handleSubmit={handleSubmitEdits} />
        </Drawer>
        <Drawer
          title="Leveling Options"
          open={!!selectedClassForLeveling}
          onClose={() => setSelectedClassForLeveling("")}
          className="class-form-root"
        >
          <LevelingDrawer handleSubmit={handleLevelingEntered} classObj={selectedClassForLeveling} />
        </Drawer>
      </div>
    </>
  );
};

export default DegreePlan;
