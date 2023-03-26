import React, { useState } from "react";
import { useStudentObject } from "./hook";
import Search from "./Search";
import Form from "./Form";
import { Drawer } from "antd";

const DegreePlan = (student) => {
  const props = useStudentObject(student);
  const [open, setOpen] = useState(false);

  return (
    <div className="degree-plan-root">
      <Form
        student={student}
        props={props}
        setDrawerOpen={setOpen}
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
