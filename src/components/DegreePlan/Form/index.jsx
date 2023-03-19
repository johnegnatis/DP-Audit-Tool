import {
  getDatePicker,
  getDropdown,
  getForm,
  getRadio,
} from "./inputComponents";
import { formatGrid, formatHalfGrid, getSpan } from "./gridLayout";
import { Button } from "antd";
import { tracks } from "../../../utils/constants";
import ClassTable from "./Table";

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
      cell_two: getForm(name, setName),
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

  const openDrawer = (options) => {
    //TODO: put options based off options
    setDrawerOpen(true);
  };

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
        <ClassTable
          title="Core Courses"
          subtitle="15 credit Hours / 3.19 grade point required (HARDCODED)"
          classes={student.student.classes}
          openDrawer={() => openDrawer([])}
        />
        <ClassTable
          title="One of the Following Courses"
          subtitle=""
          classes={[]}
          openDrawer={() => openDrawer([])}
        />
        <ClassTable
          title="Approved 6000 Level Courses"
          subtitle=""
          classes={[]}
          openDrawer={() => openDrawer([])}
        />
        <ClassTable
          title="Prerequisites"
          subtitle=""
          classes={[]}
          openDrawer={() => openDrawer([])}
        />
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
