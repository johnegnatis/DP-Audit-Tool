import { Icon } from "@iconify/react";
import { Button } from "antd";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import examplePDF from "../../assets/files/Modano, Modano DP-Intelligent Systems.pdf";
import { iconNames, pages } from "../../utils/constants";
import { changePage, useGlobalState } from "../GlobalState";

export default function PdfPreview() {
  const [studentList] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  const [zoom, setZoom] = useState(1);
  const maxZoom = 2;
  const minZoom = 0.5;
  const interval = 0.1;
  const zoomIn = () => {
    setZoom((prev) => (prev + interval > maxZoom ? maxZoom : prev + interval));
  };
  const zoomOut = () => {
    setZoom((prev) => (prev - interval < minZoom ? minZoom : prev - interval));
  };

  console.log(studentList);
  const student = studentList.find(
    (student) => student.student.studentId === selectedId
  );
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  } catch (e) {
    // do nothing
    console.log(e);
  }
  const path = examplePDF;
  return (
    <div className="pdf-preview-root">
      <div className="pdf-preview">
        <h1 className="title">DOCUMENT PREVIEW</h1>
        <div className="viewer">
          <Document file={path} renderMode="canvas">
            <Page
              scale={zoom}
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
      <footer>
        <div className="return">
          <span
            onClick={() => changePage(studentList, student, pages.degreePlan)}
          >
            {"< Return to edit"}
          </span>
        </div>
        <div className="zoom">
          <Icon
            icon={iconNames.zoomOut}
            onClick={() => zoomOut()}
            className="icon xs grey"
          />
          <span className="percent">{Math.round(zoom * 100) + "%"}</span>
          <Icon
            icon={iconNames.zoomIn}
            onClick={() => zoomIn()}
            className="icon xs grey"
          />
        </div>
        <div className="save-continue">
          <Button
            onClick={() => {}}
            className="button grey-border white-bg"
            size="large"
          >
            <Icon icon={iconNames.import} className="icon xxs grey" />
            <span>Save PDF</span>
          </Button>
          <Button onClick={() => {}} className="button orange-bg" size="large">
            Continue to Audit Report
          </Button>
        </div>
      </footer>
    </div>
  );
}
