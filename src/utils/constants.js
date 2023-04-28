export const iconNames = {
  file: "ion:document-text-outline",
  checkbox: "material-symbols:check-circle-outline-rounded",
  redX: "ph:x-circle-bold",
  plus: "material-symbols:add-rounded",
  trash: "ph:trash-bold",
  checkboxMinus: "bxs:checkbox-minus",
  search: "ic:outline-search",
  import: "uil:import",
  zoomIn: "heroicons:magnifying-glass-plus-20-solid",
  zoomOut: "heroicons:magnifying-glass-minus-20-solid",
  threeDots: "ph:dots-three-vertical",
  close: "material-symbols:close",
  question: "radix-icons:question-mark-circled",
  warning: "mdi:warning-circle",
  settings: "material-symbols:settings",
  openFile: "fluent-emoji-high-contrast:open-file-folder",
  openDir: "material-symbols:folder-copy-outline",
  dot: "entypo:dot-single",
};
export const settingsKeys = {
  defaultPathForDegreePlan: "default-path-for-degree-plan",
  defaultPathForAudit: "default-path-for-audit",
  defaultPathForTranscript: "default-path-for-transcript",
};
export const pages = {
  homePage: "home-page",
  degreePlan: "degree-plan",
  pdfPreview: "pdf-preview",
  notFound: "not-found",
};

const numberToStringDict = {
  0: "Zero",
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};
export const getNumberToString = (number, lowerCase = false) => {
  let numberStr = "Zero";

  if (number > 10) return number.toString();
  else if (number >= 0) numberStr = numberToStringDict[number];

  if (lowerCase) return numberStr.toLowerCase();
  return numberStr;
};
export const disableType = {
  move: 'move',
  copy: 'copy',
  none: '',
}
export const levelingOptions = [
  {
    label: "Completed",
    key: "2",
  },
  {
    label: "Waived",
    key: "3",
  },
  {
    label: "Not required by plan or electives",
    key: "4",
  },
  {
    label: "Other",
    key: "5",
  },
];
export const levelingMap = {
  none: "None",
  completed: "Completed",
  waived: "Waived",
  notRequired: "Not required by plan or electives",
  other: "Other",
};

export const classesDBRequestMap = {
  get: 'get', 
  insert: 'insert',
  delete: 'delete',
  update: 'update',
}

export const tableTypes = {
  core: "core",
  following: "following",
  electives: "electives",
  additional: "additional",
  prerequisites: "prerequisites",
};
export const tableList = [
  tableTypes.core,
  tableTypes.following,
  tableTypes.electives,
  tableTypes.prerequisites,
  tableTypes.additional,
];
export const tableNames = {
  core: "Core Courses",
  electives: "Elective Courses",
  additional: "Additional Electives",
  prerequisites: "Prerequisites",
};

export const genericStudent = {
  name: "Generic Student",
  studentId: 1111111,
  options: {
    fastTrack: false,
    thesis: false,
  },
  dates: {
    admitted: "21F",
    expected_graduation: "24S",
  },
  classes: [
    {
      name: "Statistical Methods for Data Sciences",
      number: "CS 6313",
      semester: "22S",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core",
      leveling: "",
    },
    {
      name: "Big Data Management and Analytics",
      number: "CS 6350",
      semester: "22s",
      transfer: "",
      grade: "B+",
      attempted_credits: "",
      type: "core",
      leveling: "",
    },
    {
      name: "Design and Analysis of Computer Algorithms",
      number: "CS 6363",
      semester: "22s",
      transfer: "",
      grade: "A-",
      attempted_credits: "",
      type: "core",
      leveling: "",
    },
    {
      name: "Machine Learning",
      number: "CS 6375",
      semester: "21f",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "core",
      leveling: "",
    },
    {
      name: "Social Network Analytics",
      number: "CS 6301",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "following",
      leveling: "",
    },
    {
      name: "Natural Language Processing",
      number: "CS 6320",
      semester: "21f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "following",
      leveling: "",
    },
    {
      name: "Video Analytics",
      number: "CS 6327",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "following",
      leveling: "",
    },
    {
      name: "Statistics for Machine Learning",
      number: "CS 6347",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "following",
      leveling: "",
    },
    {
      name: "Database Design",
      number: "CS 6360",
      semester: "",
      transfer: "",
      grade: "A-",
      attempted_credits: "",
      type: "following",
      leveling: "",
    },
    {
      name: "Virtual Reality",
      number: "CS 6334",
      semester: "",
      transfer: "",
      grade: "B",
      attempted_credits: "",
      type: "electives",
      leveling: "",
    },
    {
      name: "Theory of Computation",
      number: "CS 6382",
      semester: "21f",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "electives",
      leveling: "",
    },
    {
      name: "Natural Language Processing",
      number: "CS 6320",
      semester: "22s",
      transfer: "",
      grade: "A",
      attempted_credits: "",
      type: "electives",
      leveling: "",
    },
    {
      name: "Network Security",
      number: "CS 6349",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "electives",
      leveling: "",
    },
    {
      name: "Sftwr Test/Validatn/Verificatn",
      number: "CS 6367",
      semester: "22f",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "electives",
      leveling: "",
    },
    {
      name: "Software Maint Evolut & Re-Eng",
      number: "SE 6356",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "additional",
      leveling: "",
    },
    {
      name: "Computer Science I",
      number: "CS 5303",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "additional",
      leveling: "",
    },
    {
      name: "Computer Science II",
      number: "CS 5330",
      semester: "23s",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
      leveling: levelingMap.notRequired,
    },
    {
      name: "Discrete Structures",
      number: "CS 5333",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
      leveling: "",
    },
    {
      name: "Algorithm Analysis & Data Structures",
      number: "CS 5343",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
      leveling: levelingMap.waived,
    },
    {
      name: "Operating System Concepts",
      number: "CS 5348",
      semester: "",
      transfer: "",
      grade: "",
      attempted_credits: "",
      type: "prerequisites",
      leveling: levelingMap.completed,
    },
    {
      name: "Probability & Statistics in CS",
      number: "CS 3341",
      semester: "",
      transfer: "",
      grade: "A-",
      attempted_credits: "",
      type: "prerequisites",
      leveling: "",
    },
  ],
  track: "Data Science",
};
