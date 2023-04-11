import { Icon } from "@iconify/react";
import { Button } from "antd";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { iconNames, pages } from "../../utils/constants";
import { changePage, useGlobalState } from "../GlobalState";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import NavigationBar from "../NavigationBar";
import { eel } from "../../utils/eel";
import { sendError, sendLoading, sendSuccess, sendWarning } from "../../utils/methods";
import AskSignature from "./AskSignature";

export default function PdfPreview({ serverPort }) {
  const [studentList] = useGlobalState("students");
  const [selectedId] = useGlobalState("selectedId");
  const studentObj = studentList.find((student) => student.student.studentId === selectedId);
  const pdfName = studentObj.student.pdfName;
  const getStudentFile = () => {
    return {
      url: `http://localhost:${serverPort}/` + pdfName,
    };
  };
  const [askSignatureOpen, setAskSignatureOpen] = useState(false);
  const [signature, setSignature] = useState(false);
  const onSavePDF = () => {
    setSignature("");
    setAskSignatureOpen(true);
  };
  const onClose = () => {
    setSignature("");
    setAskSignatureOpen(false);
  };
  const savePdfWithSignature = (hasSignature, flattenPDF) => {
    const sign = hasSignature ? signature : "";
    const key = "loading";
    setAskSignatureOpen(false);
    sendLoading("Waiting on Degree Plan Creation", key);
    eel
      .savePDF(pdfName, sign, flattenPDF)()
      .then((result) => {
        sendSuccess(`PDF saved to ${result} as ${pdfName}`, key);
      })
      .catch((e) => {
        if (e.errorText === "FileNotFoundError(2, 'No such file or directory')") sendWarning("Directory not valid", key);
        else sendError("PDF could not be saved.", key);
        console.error(e);
      });
  };
  const handleDownloadAuditReport = () => {
    const key = "waiting";
    sendLoading("Waiting on Audit Creation", key);
    eel
      .doAudit(studentObj.student)()
      .then((result) => {
        if (!result) {
          sendWarning("Canceled", key);
        } else {
          sendSuccess("Audit Report Saved at " + result, key);
        }
      })
      .catch((e) => {
        sendError("Audit Report Unsuccessful", key);
      });
  };
  const [path, setPath] = useState("");
  const [resetSignal, setResetSignal] = useState(false);
  useEffect(() => {
    let timeout;
    if (pdfName) {
      timeout = setTimeout(() => {
        setPath(getStudentFile());
      }, 100);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [resetSignal]);
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

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  return (
    <>
      <NavigationBar />
      <div className="pdf-preview-root">
        <div className="pdf-preview">
          <h1 className="title">DOCUMENT PREVIEW</h1>
          <h5 className="warning">***Edits to this page will not be saved***</h5>
          <div className="viewer" style={{ pointerEvents: "none" }}>
            <Document
              file={path}
              renderMode="canvas"
              onLoadError={(e) => setResetSignal((prev) => !prev)}
              onSourceError={(e) => setResetSignal((prev) => !prev)}
            >
              <Page scale={zoom} pageNumber={1} renderTextLayer={false} />
            </Document>
          </div>
        </div>
        <footer>
          <div className="return">
            <span onClick={() => changePage(studentList, studentObj, pages.degreePlan)}>{"< Return to edit"}</span>
          </div>
          <div className="zoom">
            <Icon icon={iconNames.zoomOut} onClick={() => zoomOut()} className="icon xs pointer grey" />
            <span className="percent">{Math.round(zoom * 100) + "%"}</span>
            <Icon icon={iconNames.zoomIn} onClick={() => zoomIn()} className="icon xs pointer grey" />
          </div>
          <div className="save-continue">
            <Button onClick={() => onSavePDF()} className="button grey-border white-bg" size="large">
              <Icon icon={iconNames.import} className="icon xxs grey" />
              <span>Download PDF</span>
            </Button>
            <Button onClick={() => handleDownloadAuditReport()} className="button orange-bg" size="large">
              Download Audit Report
            </Button>
          </div>
        </footer>
      </div>
      <AskSignature
        open={askSignatureOpen}
        savePDF={savePdfWithSignature}
        signature={signature}
        setSignature={setSignature}
        onClose={onClose}
      />
    </>
  );
}
