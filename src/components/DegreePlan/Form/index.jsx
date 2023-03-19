import { getDatePicker, getDropdown, getForm, getRadio } from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";
import { columns } from "./table";
import { Table, Button } from "antd";
import { tracks } from "../../../utils/constants";

const Form = ({ student, props, setDrawerOpen }) => {
  const {
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
  } = props;
  const fullLayout = [
    { 
      cell_one: getSpan("Track"), 
      cell_two: getDropdown(track, setTrack, tracks),
    },
    { 
      cell_one: getSpan("Name"), 
      cell_two: getForm(name, setName) 
    },
    {
      cell_one: getSpan("Student ID"),
      cell_two: getForm(studentId, setStudentId),
    },
  ];

  const halfLayout = [
    {
      cell_one: getSpan("Semester Admitted"),
      cell_two: getDatePicker(admittedDate, setAdmittedDate),
      cell_three: getSpan("Anticipated Graduation"),
      cell_four: getDatePicker(graduationDate, setGraduationDate),
    },
    {
      cell_one: getSpan("Fast Track"),
      cell_two: getRadio(fastTrack, setFastTrack),
      cell_three: getSpan("Thesis"),
      cell_four: getRadio(thesis, setThesis),
    },
  ];
  return (
    <div className="degree-plan">
      <h1 className="title">Degree Plan</h1>
      <div className="general-info">
        <h2 className="subtitle">General Information</h2>
        {formatGrid(fullLayout, 5, 19)}
        {formatHalfGrid(halfLayout, 5, 5, 9, 5)}
        {/* TODO: at high zooms, some text overlaps here */}
      </div>
      <div>
        <h2 className="subtitle">Core Courses</h2>
        <h3 className="course-info">
          15 credit Hours / 3.19 grade point required (HARDCODED)
        </h3>
        <Table columns={columns} dataSource={student.student.classes} />
        <Button className="button" onClick={() => setDrawerOpen(true)}>Add Class</Button>
        <h2 className="subtitle">One of the Following Courses</h2>
        <Table columns={columns} dataSource={[]} />
        <h2 className="subtitle">Approved 6000 Level Courses</h2>
        <h3 className="course-info">
          15 credit Hours / 3.19 grade point required (HARDCODED)
        </h3>
        <Table columns={columns} dataSource={[]} />
        <h2 className="subtitle">Prerequisites</h2>
        <Table columns={columns} dataSource={[]} />
        <div className="signature">
          <span>Academic Advisor Signature : </span>
          {getForm(signature, setSignature)}
        </div>
        <div className="generate-button">
          <Button onClick={() => {}} className="button orange-bg" size="large">
            GENERATE DEGREE PLAN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form;
