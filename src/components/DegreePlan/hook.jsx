import { useState } from "react";
import dayjs from "dayjs";

export function useStudentObject(student) {
  const defaults = {
    track: '',
    name: student.student.name,
    studentId: student.student.studentId,
    admitted:
      (student.student.dates &&
        dayjs(student.student.dates.semesterAdmitted)) ||
      "",
    graduation:
      (student.student.dates &&
        dayjs(student.student.dates.expectedGraduation)) ||
      "",
    fastTrack:
      (student.student.options && student.student.options.fastTrack) || false,
    thesis:
      (student.student.options && student.student.options.thesis) || false,
    signature: "",
    searchInput: "",
  };

  const [track, setTrack] = useState(defaults.track);
  const [name, setName] = useState(defaults.name);
  const [studentId, setStudentId] = useState(defaults.studentId);
  const [admittedDate, setAdmittedDate] = useState(defaults.admitted);
  const [graduationDate, setGraduationDate] = useState(defaults.graduation);
  const [fastTrack, setFastTrack] = useState(defaults.fastTrack);
  const [thesis, setThesis] = useState(defaults.thesis);
  const [signature, setSignature] = useState(defaults.signature);
  const [coreClasses, setCoreClasses] = useState(defaults.coreClasses);
  const [searchInput, setSearchInput] = useState(defaults.searchInput);

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
  };
}
