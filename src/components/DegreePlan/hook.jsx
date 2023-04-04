import { useState, useEffect, useMemo } from "react";

export function useStudentObject(student) {
  const studentObj = student.student;
  const filterClass = (filter, array) => {
    if (!Array.isArray(array)) return [];
    return array.filter((obj) => obj.type === filter);
  };

  const [track, setTrack] = useState(studentObj.track || '');
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

  useEffect(() => {
    setTrack(studentObj.track || "");
    setName(studentObj.name || "");
    setStudentId(studentObj.studentId || -1);
    setAdmittedDate((studentObj.dates && studentObj.dates.admitted) || "");
    setGraduationDate(
      (studentObj.dates && studentObj.dates.expected_graduation) || ""
    );
    setFastTrack((studentObj.options && studentObj.options.fastTrack) || false);
    setThesis((studentObj.options && studentObj.options.thesis) || false);
    setSearchInput("");
    setCore(filterClass("core", studentObj.classes));
    setFollowing(filterClass("one_of_the_following", studentObj.classes));
    setElective(filterClass("core_electives", studentObj.classes));
    setPrerequisites(filterClass("prerequisites", studentObj.classes));
  }, [studentObj]);

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
  }, [name, studentId, fastTrack, thesis, admittedDate, graduationDate, track, pdfName, core, following, elective, prerequisites]);

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
  };
}

export function useEditClass(classObj) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [transfer, setTransfer] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    setName((classObj.class && classObj.class.name) || "");
    setNumber((classObj.class && classObj.class.number) || "");
    setSemester((classObj.class && classObj.class.semester) || "");
    setTransfer((classObj.class && classObj.class.transfer) || "");
    setGrade((classObj.class && classObj.class.grade) || "");
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
