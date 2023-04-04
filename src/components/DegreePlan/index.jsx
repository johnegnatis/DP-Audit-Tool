import React, { useMemo, useState } from "react";
import { useEditClass, useStudentObject } from "./hook";
import Search from "./Search";
import Form from "./Form";
import { Drawer } from "antd";
import { useGlobalState, changePage } from "../GlobalState";
import EditClass from "./Form/EditClass";
import SwappingNotification from "./SwappingNotification"

const mockStudent = {
  name: "Lasso, Ted",
  studentId: 2021504218,
  options: {
    fastTrack: false,
    thesis: false,
  },
  dates: {
    admitted: "21F",
    expected_graduation: "24S",
  },
  classes: [
    {
      name: "Statistical Methods for Data Sciences",
      number: "CS 6313",
      semester: "22S",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core",
    },
    {
      name: "Big Data Management and Analytics",
      number: "CS 6350",
      semester: "22s",
      transfer: "",
      grade: "B+",
      attempted_credits: "",
      type: "core",
    },
    {
      name: "Design and Analysis of Computer Algorithms",
      number: "CS 6363",
      semester: "22s",
      transfer: "",
      grade: "A-",
      attempted_credits: "",
      type: "core",
    },
    {
      name: "Machine Learning",
      number: "CS 6375",
      semester: "21f",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core",
    },
    {
      name: "Social Network Analytics",
      number: "CS 6301",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "one_of_the_following",
    },
    {
      name: "Natural Language Processing",
      number: "CS 6320",
      semester: "21f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "one_of_the_following",
    },
    {
      name: "Video Analytics",
      number: "CS 6327",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "one_of_the_following",
    },
    {
      name: "Statistics for Machine Learning",
      number: "CS 6347",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "one_of_the_following",
    },
    {
      name: "Database Design",
      number: "CS 6360",
      semester: "",
      transfer: "",
      grade: "A-",
      attempted_credits: "",
      type: "one_of_the_following",
    },
    {
      name: "Virtual Reality",
      number: "CS 6334",
      semester: "",
      transfer: "",
      grade: "B",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Theory of Computation",
      number: "CS 6382",
      semester: "21f",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Natural Language Processing",
      number: "CS 6320",
      semester: "22s",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Network Security",
      number: "CS 6349",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Sftwr Test/Validatn/Verificatn",
      number: "CS 6367",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Software Maint Evolut & Re-Eng",
      number: "SE 6356",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "core_electives",
    },
    {
      name: "Computer Science I",
      number: "CS 5303",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "additional_electives",
    },
    {
      name: "Computer Science II",
      number: "CS 5330",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
    },
    {
      name: "Discrete Structures",
      number: "CS 5333",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
    },
    {
      name: "Algorithm Analysis & Data Structures",
      number: "CS 5343",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
    },
    {
      name: "Operating System Concepts",
      number: "CS 5348",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
    },
    {
      name: "Probability & Statistics in CS<<",
      number: "CS 3341<<",
      semester: "",
      transfer: "",
      grade: "*** A- ***",
      attempted_credits: "",
      type: "prerequisites",
    },
  ],
  track: "Data Science",
};

const DegreePlan = (student) => {
  // student obj hooks
  const [students] = useGlobalState("students");
  const props = useStudentObject({ student: mockStudent });
  const { setCore, setFollowing, setElective, setPrerequisites } = props;

  // add class hooks
  const [addClassOpen, setAddClassOpen] = useState(false);

  // edit class hooks
  const [selectedClassForEdit, setSelectedClassForEdit] = useState("");
  const [swappingClass, setSwappingClass] = useState("");
  const editClassProps = useEditClass(selectedClassForEdit);
  const disableActions = useMemo(() => !!swappingClass, [swappingClass]);

  const navigatePage = (page) => {
    changePage(students, student, page);
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
  // When the first class has been selected for swapping
  const handleSwapping = () => {
    setSwappingClass(selectedClassForEdit);
    setSelectedClassForEdit("");
  };
  // When the second class has been selected for swapping
  const handleExecuteSwap = (obj) => {
    const swapOne = obj;
    const swapTwo = swappingClass;

    const swapOneSetter = getClassSetter(swapOne.class.type);
    const swapTwoSetter = getClassSetter(swapTwo.class.type);
    if (!swapOneSetter || !swapTwoSetter) return;

    // swap the type for table placement later
    const temp = swapOne.class.type;
    swapOne.class.type = swapTwo.class.type;
    swapTwo.class.type = temp;

    swapOneSetter((prev) => {
      const newList = [...prev];
      newList[swapOne.index] = swapTwo.class;
      return newList;
    });
    swapTwoSetter((prev) => {
      const newList = [...prev];
      newList[swapTwo.index] = swapOne.class;
      return newList;
    });
    setSwappingClass("");
  };
  const handleCancelSwap = () => {
    setSwappingClass('');
  }
  const handleDeleteClass = () => {
    const setter = getClassSetter(selectedClassForEdit.class.type);
    if (!setter) return;
    setter((prev) => {
      return prev.filter((_, index) => index !== selectedClassForEdit.index);
    });
    setSelectedClassForEdit("");
  }

  return (
    <div className={`degree-plan-root ${disableActions ? "swapping" : ""}`}>
      <Form
        disableActions={disableActions}
        student={student}
        props={props}
        setDrawerOpen={setAddClassOpen}
        navigatePage={navigatePage}
        setClassForEdit={setSelectedClassForEdit}
        swapping={!!swappingClass}
        handleExecuteSwap={handleExecuteSwap}
      />
      <SwappingNotification open={!!swappingClass} onCancel={handleCancelSwap}/>
      <Drawer
        title="Search for classes"
        open={addClassOpen}
        onClose={() => setAddClassOpen(false)}
      >
        <Search
          searchInput={props.searchInput}
          setSearchInput={props.setSearchInput}
        />
      </Drawer>
      <Drawer
        title="Edit class"
        open={!!selectedClassForEdit}
        onClose={() => setSelectedClassForEdit("")}
      >
        <EditClass
          handleSwapping={handleSwapping}
          handleSubmit={handleSubmitEdits}
          handleDeleteClass={handleDeleteClass}
          editClassProps={editClassProps}
        />
      </Drawer>
    </div>
  );
};

export default DegreePlan;
