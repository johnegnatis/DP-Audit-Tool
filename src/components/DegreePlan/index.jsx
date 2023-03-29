import React, { useState } from "react";
import { useStudentObject } from "./hook";
import Search from "./Search";
import Form from "./Form";
import { Drawer } from "antd";
import { useGlobalState, changePage } from "../GlobalState";

const DegreePlan = (student) => {
  const [students] = useGlobalState("students");
  const props = useStudentObject(student);
  const [open, setOpen] = useState(false);

  const navigatePage = (page) => {
    console.log(page);
    changePage(students, student, page);
  };

  return (
    <div className="degree-plan-root">
      <Form
        student={student}
        props={props}
        setDrawerOpen={setOpen}
        navigatePage={navigatePage}
      />
      <Drawer
        title="Search for classes"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Search
          searchInput={props.searchInput}
          setSearchInput={props.setSearchInput}
        />
      </Drawer>
    </div>
  );
};

export default DegreePlan;
