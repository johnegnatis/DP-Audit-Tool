import React, { useCallback, useMemo, useState } from "react";
import LevelingDrawer from "./LevelingDrawer";
import { useStudentObject } from "../Hooks/degreePlanHooks";
import AddClass from "./AddClass";
import Form from "./Form";
import { Button, Drawer, message } from "antd";
import { useGlobalState, changePage, returnToHome } from "../GlobalState";
import EditClass from "./EditClass";
import { eel } from "../../utils/eel";
import { disableType, pages, tableNames } from "../../utils/constants";
import { handleError, sendError, sendSuccess, sendWaiting, sendWarning } from "../../utils/methods";
import NavigationBar from "../NavigationBar";
import { useTrackOptions } from "../Hooks/databaseHooks";
import { useClassList } from "../Hooks/classListHooks";

const DegreePlan = ({ student, databaseProps }) => {
  // STUDENT OBJ LOGIC
  const [students] = useGlobalState("students");
  const formProps = useStudentObject(student);
  const { searchInput, setSearchInput, getClassSetter, studentObjectJSON, track, setClasses } = formProps;

  const [refetchClassList, setRefetchClassList] = useState(true);
  const classListProps = useClassList(refetchClassList);
  const { insertClass, updateClass, deleteClass } = classListProps;
  const trackOptionProps = useTrackOptions(track);
  const classOptionProps = { ...trackOptionProps, ...classListProps, refetchClassList };
  const handleSelectTrack = () => {
    const newStudent = student;
    newStudent.track = track;
    eel
      .designateClasses(newStudent)()
      .then((result) => {
        const newStudent = JSON.parse(result);
        setClasses(newStudent.classes);
      })
      .catch((e) => handleError(e));
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
      .catch((e) => handleError(e));
  };
  const saveStudentObject = () => {
    navigatePage(pages.degreePlan);
  };
  const returnHome = () => {
    saveStudentObject();
    returnToHome();
  };

  // Database
  const { trackOptions } = databaseProps;

  // ADD LOGIC
  const [addClassTable, setAddClassTable] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const handleAddClassDrawerOpen = useCallback(
    (type, options, canEdit = false) => {
      setAddClassTable(type);
      setIsSearch(options && options.length > 0); // if there are options, start with searching options
      setClassOptions(options);
      setIsEditable(canEdit);
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
      insertClass({ name: obj.name, number: obj.number });
      setRefetchClassList((prev) => !prev);
    },
    [addClassTable]
  );
  const handleAddClassDrawerClose = useCallback(() => {
    setAddClassTable("");
  }, [classOptionProps]);
  const handleDeleteFromClassList = useCallback((number) => {
    deleteClass(number);
    setRefetchClassList((prev) => !prev);
    handleAddClassDrawerClose();
  }, []);

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
      <div style={{ minWidth: "25%", minHeight: "10%", padding: "10px" }}>
        <p>Move the following course to the desired location:</p>
        {obj && obj.class && <p style={{ fontWeight: "700", paddingBottom: "10px" }}>{obj.class.name}</p>}
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

  // COPY LOGIC
  const [selectedClassForCopy, setSelectedClassForCopy] = useState(null);
  const copyKey = "copy-message";
  // When the first class has been selected for moving
  const handleCopyingStart = useCallback((obj) => {
    message.config({
      icon: null,
    });
    sendWaiting(
      <div style={{ minWidth: "25%", minHeight: "10%", padding: "10px" }}>
        <p>Copy the following course to the desired location:</p>
        {obj && obj.class && <p style={{ fontWeight: "700", paddingBottom: "10px" }}>{obj.class.name}</p>}
        <Button
          className="orange-bg button"
          onClick={() => {
            setSelectedClassForCopy("");
            message.destroy(copyKey);
          }}
        >
          Cancel
        </Button>
      </div>,
      copyKey
    );
    setSelectedClassForCopy(obj);
  }, []);
  // When the second class has been selected for moving
  const handleCopyClick = useCallback(
    (obj) => {
      const copyOne = selectedClassForCopy;
      const copyTwo = obj;

      const copyOneSetter = getClassSetter(copyOne.class.type);
      const copyTwoSetter = getClassSetter(copyTwo.class.type);
      if (!copyOneSetter || !copyTwoSetter) {
        sendError("Copy Unsuccessful", copyKey);
        setSelectedClassForCopy("");
        return;
      }

      // give copyOne the targets type
      let copyOccurInSameTable = true;
      if (copyOne.class.type !== copyTwo.class.type) {
        copyOne.class.type = copyTwo.class.type;
        copyOccurInSameTable = false;
      }

      // insert copy1 right below copy2
      if (!copyOccurInSameTable) {
        copyTwoSetter((prev) => {
          let i;
          const newArray = [];
          for (i = 0; i < prev.length; i++) {
            newArray.push(prev[i]);
            if (i === copyTwo.index) {
              newArray.push(copyOne.class);
            }
          }
          return newArray;
        });
      } else {
        copyOneSetter((prev) => {
          let i;
          const newArray = [];
          for (i = 0; i < prev.length; i++) {
            newArray.push(prev[i]);
            if (i === copyTwo.index) {
              newArray.push(copyOne.class);
            }
          }
          return newArray;
        });
      }
      setSelectedClassForCopy("");
      sendSuccess("Copy Successful!", copyKey);
    },
    [selectedClassForCopy]
  );
  // If you click on header, move to top of row
  const handleCopyToTopClick = useCallback(
    (type) => {
      const copyOne = selectedClassForCopy;
      const copyTwoType = type;

      const copyOneSetter = getClassSetter(copyOne.class.type);
      const copyTwoSetter = getClassSetter(copyTwoType);
      if (!copyOneSetter || !copyTwoSetter) {
        sendError("Copy Unsuccessful", copyKey);
        setSelectedClassForCopy("");
        return;
      }

      // give copyOne the targets type
      let copyOccurInSameTable = true;
      if (copyOne.class.type !== copyTwoType) {
        copyOne.class.type = type;
        copyOccurInSameTable = false;
      }

      copyTwoSetter((prev) => {
        return [copyOne.class, ...prev];
      });
      setSelectedClassForCopy("");
      sendSuccess("Copy Successful!", copyKey);
    },
    [selectedClassForCopy]
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
  const allDisabled = useMemo(() => {
    let disabled = disableType.none;
    if (selectedClassForMove) disabled = disableType.move;
    if (selectedClassForCopy) disabled = disableType.copy;
    return disabled;
  }, [selectedClassForMove, selectedClassForCopy]);
  // when editing or moving class, highlight that row
  const selectedRow = useMemo(() => {
    const row = selectedClassForEdit || selectedClassForMove || selectedClassForCopy;
    if (row) return { index: row.index, table: row.class.type };
    else if (selectedClassForLeveling) return { index: selectedClassForLeveling.key, table: selectedClassForLeveling.table };
  }, [selectedClassForCopy, selectedClassForEdit, selectedClassForMove, selectedClassForLeveling]);
  return (
    <>
      <NavigationBar saveStudentObject={saveStudentObject} />
      <div className={`degree-plan-root ${allDisabled ? "moving" : ""}`}>
        <Form
          handleReturnToHome={returnHome}
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
          setClassForCopy={handleCopyingStart}
          handleCopyClick={handleCopyClick}
          handleCopyToTopClick={handleCopyToTopClick}
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
            isEditable={isEditable}
            setIsSearch={setIsSearch}
            searchOptions={classOptions}
            handleSubmitAddClass={handleSubmitAddClass}
            onDelete={handleDeleteFromClassList}
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
        <footer>
          <div className="return">
            <span onClick={() => returnHome()}>{"< Return to home"}</span>
          </div>
          <div className="generate-button">
            <Button onClick={generatePDF} className="button orange-bg" size="large" disabled={allDisabled}>
              Preview Degree Plan
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DegreePlan;
