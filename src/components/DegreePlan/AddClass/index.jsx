import { Icon } from "@iconify/react";
import { iconNames } from "../../../utils/constants";
import react, { useMemo, useState } from "react";
import { getSpan } from "../Form/gridLayout";
import { getForm, getNumberForm } from "../Form/inputComponents";
import { useClassForm } from "../../Hooks/degreePlanHooks";
import { Button } from "antd";

const AddClass = ({ searchInput, setSearchInput, isSearch, setIsSearch, searchOptions, handleSubmitAddClass }) => {
  const { name, setName, number, setNumber, semester, setSemester, transfer, setTransfer, grade, setGrade } = useClassForm(
    null,
    searchOptions
  );

  const setSearchClassForAdd = (obj) => {
    setIsSearch(false);
    setName(obj.name);
    setNumber(obj.number);
  };

  const addClass = {
    number: "+",
    name: "New Course",
    onClickMe: () => setSearchClassForAdd({ name: "", number: null }),
  };
  const onSubmitNewClass = () => {
    handleSubmitAddClass({
      name,
      number,
      semester,
      transfer,
      grade,
      leveling: "",
      attempted_credits: "",
    });
  };

  const filterClasses = useMemo(() => {
    const filtered = searchOptions.filter(
      (obj) => obj.number.includes(searchInput.toUpperCase()) || obj.name.includes(searchInput.toUpperCase())
    );
    return [addClass, ...filtered];
  }, [searchInput, searchOptions]);

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
              onClick={!!classID.onClickMe ? classID.onClickMe : () => setSearchClassForAdd(classID)}
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
      {searchOptions && searchOptions.length > 0 && (
        <span className="back" onClick={() => setIsSearch(true)}>
          {"< Return to search"}
        </span>
      )}
      <br />
      <br />
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
          Submit
        </Button>
      </div>
    </div>
  );
};
export default AddClass;
