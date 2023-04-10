import { useState, useEffect, useMemo, useCallback } from "react";
import { tableList, tableTypes } from "../../utils/constants";

export function useStudentObject(student) {
  const filterClass = (filter, array) => {
    if (!Array.isArray(array)) return [];
    return array.filter((obj) => obj.type === filter);
  };

  const [track, setTrack] = useState(student.track || "");
  const [name, setName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [admittedDate, setAdmittedDate] = useState(null);
  const [graduationDate, setGraduationDate] = useState(null);
  const [fastTrack, setFastTrack] = useState(null);
  const [thesis, setThesis] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [core, setCore] = useState([]);
  const [following, setFollowing] = useState([]);
  const [elective, setElective] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [pdfName, setPdfName] = useState(null);

  const classSetterLookup = {
    core: setCore,
    following: setFollowing,
    electives: setElective,
    prerequisites: setPrerequisites,
  };
  const getClassSetter = (table) => {
    // returns the appropriate class
    if (tableList.includes(table)) {
      return classSetterLookup[table];
    } else {
      console.error("Invalid table");
      return null;
    }
  };

  useEffect(() => {
    setTrack(student.track || "");
    setName(student.name || "");
    setStudentId(student.studentId || -1);
    setAdmittedDate((student.dates && student.dates.admitted) || "");
    setGraduationDate((student.dates && student.dates.expected_graduation) || "");
    setFastTrack((student.options && student.options.fastTrack) || false);
    setThesis((student.options && student.options.thesis) || false);
    setSearchInput("");
    setCore(filterClass(tableTypes.core, student.classes));
    setFollowing(filterClass(tableTypes.following, student.classes));
    setElective(filterClass(tableTypes.electives, student.classes));
    setPrerequisites(filterClass(tableTypes.prerequisites, student.classes));
  }, [student]);

  const setClasses = useCallback((newClasses) => {
    setCore(filterClass(tableTypes.core, newClasses));
    setFollowing(filterClass(tableTypes.following, newClasses));
    setElective(filterClass(tableTypes.electives, newClasses));
    setPrerequisites(filterClass(tableTypes.prerequisites, newClasses));
  }, []);

  const studentObjectJSON = useMemo(() => {
    const classList = [...core, ...following, ...elective, ...prerequisites];
    return {
      name,
      studentId,
      options: {
        fastTrack,
        thesis,
      },
      dates: {
        admitted: admittedDate,
        expected_graduation: graduationDate,
      },
      track,
      pdfName,
      classes: classList,
    };
  }, [
    name,
    studentId,
    fastTrack,
    thesis,
    admittedDate,
    graduationDate,
    track,
    pdfName,
    core,
    following,
    elective,
    prerequisites,
  ]);

  return {
    track,
    setTrack,
    name,
    setName,
    studentId,
    setStudentId,
    admittedDate,
    setAdmittedDate,
    graduationDate,
    setGraduationDate,
    fastTrack,
    setFastTrack,
    thesis,
    setThesis,
    searchInput,
    setSearchInput,
    core,
    setCore,
    following,
    setFollowing,
    elective,
    setElective,
    prerequisites,
    setPrerequisites,
    studentObjectJSON,
    pdfName,
    setPdfName,
    getClassSetter,
    setClasses,
  };
}

export function useEditClass(classObj, deleteSignal) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [transfer, setTransfer] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    setName((classObj && classObj.class && classObj.class.name) || "");
    setNumber((classObj && classObj.class && classObj.class.number) || "");
    setSemester((classObj && classObj.class && classObj.class.semester) || "");
    setTransfer((classObj && classObj.class && classObj.class.transfer) || "");
    setGrade((classObj && classObj.class && classObj.class.grade) || "");
  }, [classObj]);

  useEffect(() => {
    if (deleteSignal) {
      setName("");
      setNumber("");
      setSemester("");
      setTransfer("");
      setGrade("");
    }
  }, [deleteSignal]);

  return {
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
  };
}