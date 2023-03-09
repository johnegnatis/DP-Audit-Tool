import React from "react";
import { useStudentObject } from "./hook";
import Search from "./Search";
import Form from "./Form";

const DegreePlan = (student) => {
  const props = useStudentObject(student);

  return (
    <div className="degree-plan-root">
      <Form
        student={student}
        props={props}
      />
      <Search searchInput={props.searchInput} setSearchInput={props.setSearchInput} />
    </div>
  );
};

export default DegreePlan;
