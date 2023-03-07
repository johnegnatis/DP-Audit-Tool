import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

export function useCustomReset(pageChangeSignal, student) {
    const defaults = {
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
        signature: '',
      };
    
      const [name, setName] = useState(defaults.name);
      const [studentId, setStudentId] = useState(defaults.studentId);
      const [admittedDate, setAdmittedDate] = useState(defaults.admitted);
      const [graduationDate, setGraduationDate] = useState(defaults.graduation);
      const [fastTrack, setFastTrack] = useState(defaults.fastTrack);
      const [thesis, setThesis] = useState(defaults.thesis);
      const [signature, setSignature] = useState(defaults.signature)
      const [coreClasses, setCoreClasses] = useState(defaults.coreClasses)
    
      useEffect(() => {
        setName(defaults.name);
        setStudentId(defaults.studentId);
        setAdmittedDate(defaults.admitted);
        setGraduationDate(defaults.graduation);
        setFastTrack(defaults.fastTrack);
        setThesis(defaults.thesis);
        setSignature(defaults.signature);
      }, [pageChangeSignal]);  
      
      return { name, setName, studentId, setStudentId, admittedDate, setAdmittedDate, graduationDate, setGraduationDate, fastTrack, setFastTrack, thesis, setThesis, signature, setSignature}
}