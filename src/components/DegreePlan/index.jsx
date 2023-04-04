import React, { useMemo, useState } from "react";
import { useStudentObject } from "./hook";
import Search from "./Search";
import Form from "./Form";
import { Drawer } from "antd";
import { useGlobalState, changePage } from "../GlobalState";
import EditClass from "./Form/EditClass";
import MovingNotification from "./MovingNotification";
import { eel } from "../../utils/eel";
import { pages } from "../../utils/constants";

const DegreePlan = (student) => {
  // student obj hooks
  const [students] = useGlobalState("students");
  const formProps = useStudentObject(student);
  const {
    setCore,
    setFollowing,
    setElective,
    setPrerequisites,
    studentObjectJSON,
  } = formProps;

  // add class hooks
  const [addClassOpen, setAddClassOpen] = useState(false);

  // edit class hooks
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  const [selectedClassForMove, setSelectedClassForMove] = useState(null);
  const allDisabled = useMemo(
    () => !!selectedClassForMove,
    [selectedClassForMove]
  );

  const navigatePage = (page, pdfName) => {
    const newStudent = {
      student: studentObjectJSON,
      page,
    };
    changePage(students, newStudent, page, student.student.studentId, pdfName);
  };
  const getClassSetter = (table) => {
    const tables = [
      "core",
      "one_of_the_following",
      "core_electives",
      "prerequisites",
    ];
    const classSetterLookup = {
      core: setCore,
      one_of_the_following: setFollowing,
      core_electives: setElective,
      prerequisites: setPrerequisites,
    };
    if (tables.includes(table)) {
      return classSetterLookup[table];
    } else {
      console.error("Invalid table");
      return null;
    }
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
    setSelectedClassForEdit("");
  };
  // When the first class has been selected for moving
  const handleMovingStart = (obj) => {
    setSelectedClassForMove(obj);
  };
  // When the second class has been selected for moving
  const handleMoveClick = (obj) => {
    const moveOne = selectedClassForMove;
    const moveTwo = obj;

    const moveOneSetter = getClassSetter(moveOne.class.type);
    const moveTwoSetter = getClassSetter(moveTwo.class.type);
    if (!moveOneSetter || !moveTwoSetter) return;

    // give moveOne the targets type
    let moveOccurInSameTable = true;
    if (moveOne.class.type !== moveTwo.class.type) {
      moveOne.class.type = moveTwo.class.type;
      moveOccurInSameTable = false;
    }

    if (moveOccurInSameTable && moveOne.index === moveTwo.index) return; // no move can occur here

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
  };
  const handleCancelSwap = () => {
    setSelectedClassForMove("");
  };
  const handleDeleteClass = (obj) => {
    const setter = getClassSetter(obj.class.type);
    if (!setter) return;
    setter((prev) => {
      return prev.filter((_, index) => index !== obj.index);
    });
  };

  const generatePDF = () => {
    console.log(studentObjectJSON)
    eel
      .makeDegreePlan(studentObjectJSON)()
      .then((pdfName) => {
        navigatePage(pages.pdfPreview, pdfName);
      })
      .catch((e) => console.log(e, "error at PDF creation"));

      // handle this async
  };

  return (
    <div className={`degree-plan-root ${allDisabled ? "moving" : ""}`}>
      <Form
        allDisabled={allDisabled}
        props={formProps}
        setDrawerOpen={setAddClassOpen}
        generatePDF={generatePDF}
        setClassForEdit={setSelectedClassForEdit}
        setClassForMove={handleMovingStart}
        handleMoveClick={handleMoveClick}
        deleteClass={handleDeleteClass}
      />
      <MovingNotification
        open={!!selectedClassForMove}
        onCancel={handleCancelSwap}
      />
      <Drawer
        title="Search for classes"
        open={addClassOpen}
        onClose={() => setAddClassOpen(false)}
      >
        <Search
          searchInput={formProps.searchInput}
          setSearchInput={formProps.setSearchInput}
        />
      </Drawer>
      <Drawer
        title="Edit class"
        open={!!selectedClassForEdit}
        onClose={() => setSelectedClassForEdit("")}
      >
        <EditClass
          classObj={selectedClassForEdit}
          handleSubmit={handleSubmitEdits}
        />
      </Drawer>
    </div>
  );
};

export default DegreePlan;
