import { Icon } from "@iconify/react";
import { iconNames } from "../../../utils/constants";
import { useMemo } from "react";

const Search = ({ searchInput, setSearchInput }) => {
  const classes = [
    { number: "CS6314", name: "WEB PROGRAMMING LANGUAGES" },
    { number: "CS6363", name: "DESIGN & ANALYS-COMP ALGORITHM" },
    { number: "CS6375", name: "MACHINE LEARNING" },
    { number: "CS6320", name: "NATURAL LANGUAGE PROCESSING" },
    { number: "CS6322", name: "INFORMATION RETRIEVAL" },
    { number: "CS6360", name: "DATABASE DESIGN" },
    { number: "CS6364", name: "ARTIFICIAL INTELLIGENCE" },
    { number: "+", name: "New Course" },
  ];
  const onInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const filterClasses = useMemo(() => {
    return classes.filter(
      (obj) =>
        obj.number.includes(searchInput.toUpperCase()) ||
        obj.name.includes(searchInput.toUpperCase())
    );
  }, [searchInput]);
  return (
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
            <div className="row" key={index}>
              <p>{classID.name}</p>
              <p>{classID.number}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Search;
