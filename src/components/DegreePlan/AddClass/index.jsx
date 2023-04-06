import { Icon } from "@iconify/react";
import { iconNames } from "../../../utils/constants";
import react, { useMemo, useState } from "react";
import { getSpan } from "../Form/gridLayout";
import { getForm, getNumberForm } from "../Form/inputComponents";
import { useEditClass } from "../hook";
import { Button } from "antd";

const AddClass = ({
  searchInput,
  setSearchInput,
  isSearch,
  setIsSearch,
  classes,
  handleSubmitAddClass,
}) => {
  const {
    name,
    setName,
    number,
    setNumber,
    semester,
    setSemester,
    transfer,
    setTransfer,
    grade,
    setGrade,
  } = useEditClass(null, isSearch);
  const addClass = {
    number: "+",
    name: "New Course",
    onclickme: () => setIsSearch(false),
  };

  const setSearchClassForAdd = (obj) => {
    setIsSearch(false);
    setName(obj.name);
    setNumber(obj.number);
  };

  const onSubmitNewClass = () => {
    handleSubmitAddClass({
      name,
      number,
      semester,
      transfer,
      grade,
    });
  };

  const filterClasses = useMemo(() => {
    const filtered = classes.filter(
      (obj) =>
        obj.number.includes(searchInput.toUpperCase()) ||
        obj.name.includes(searchInput.toUpperCase())
    );
    return [addClass, ...filtered];
  }, [searchInput]);

  const onInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  return isSearch ? (
    <div className="search-root">
      <div className="search-input">
        <div>
          <Icon className="icon xs grey" icon={iconNames.search} />
        </div>
        <input type="text" value={searchInput} onChange={onInputChange} />
      </div>
      <div className="class-list">
        {filterClasses.map((classID, index) => {
          return (
            <div
              onClick={
                !!classID.navigate
                  ? classID.navigate
                  : () => setSearchClassForAdd(classID)
              }
              className="row"
              key={index}
            >
              <p>{classID.name}</p>
              <p>{classID.number}</p>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="class-form-root">
      {classes && classes.length > 0 && (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsSearch(true)}
        >
          {"< Back to search"}
        </span>
      )}
      <div className="row">
        {getSpan("Course Title", false, false)}
        {getForm(name, setName)}
      </div>
      <div className="row">
        {getSpan("Course Number", false, false)}
        {getForm(number, setNumber)}
      </div>
      <div className="row">
        {getSpan("UTD Semester", false, false)}
        {getNumberForm(semester, setSemester, false, true)}
      </div>
      <div className="split5050 row">
        <div>
          {getSpan("Transfer", false, false)}
          {getForm(transfer, setTransfer, false, false)}
        </div>
        <div>
          {getSpan("Grade", false, false)}
          {getForm(grade, setGrade)}
        </div>
      </div>
      <div className="button-float-right">
        <Button className="button orange-bg" onClick={onSubmitNewClass}>
          Add
        </Button>
      </div>
    </div>
  );
};
export default AddClass;
