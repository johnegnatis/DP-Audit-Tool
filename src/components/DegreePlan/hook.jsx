import { useMemo, useState, useEffect } from "react";

export function useStudentObject(student) {
  const studentObj = student.student;
  const filterClass = (filter, array) => {
    if (!Array.isArray(array)) return [];
    return array.filter((obj) => obj.type === filter);
  };

  const defaults = useMemo(
    () => ({
      track: studentObj.track,
      name: studentObj.name,
      studentId: studentObj.studentId,
      admitted: studentObj.dates && studentObj.dates.admitted,
      graduation: studentObj.dates && studentObj.dates.expected_graduation,
      fastTrack: (studentObj.options && studentObj.options.fastTrack) || false,
      thesis: (studentObj.options && studentObj.options.thesis) || false,
      signature: "",
      searchInput: "",
      classes: {
        core: filterClass("core", studentObj.classes),
        following: filterClass("one_of_the_following", studentObj.classes),
        elective: filterClass("core_electives", studentObj.classes),
        prerequisites: filterClass("prerequisites", studentObj.classes),
      },
    }),
    [student]
  );

  const [track, setTrack] = useState(defaults.track);
  const [name, setName] = useState(defaults.name);
  const [studentId, setStudentId] = useState(defaults.studentId);
  const [admittedDate, setAdmittedDate] = useState(defaults.admitted);
  const [graduationDate, setGraduationDate] = useState(defaults.graduation);
  const [fastTrack, setFastTrack] = useState(defaults.fastTrack);
  const [thesis, setThesis] = useState(defaults.thesis);
  const [signature, setSignature] = useState(defaults.signature);
  const [searchInput, setSearchInput] = useState(defaults.searchInput);
  const [core, setCore] = useState(defaults.classes.core);
  const [following, setFollowing] = useState(defaults.classes.following);
  const [elective, setElective] = useState(defaults.classes.elective);
  const [prerequisites, setPrerequisites] = useState(
    defaults.classes.prerequisites
  );

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
    signature,
    setSignature,
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
  };
}

export function useEditClass(classObj) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [transfer, setTransfer] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    setName(classObj.class && classObj.class.name || "");
    setNumber(classObj.class && classObj.class.number || "");
    setSemester(classObj.class && classObj.class.semester || "");
    setTransfer(classObj.class && classObj.class.transfer || "");
    setGrade(classObj.class && classObj.class.grade || "");
  }, [classObj]);

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
