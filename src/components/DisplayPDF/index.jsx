import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import { extractErrorMessage } from '../../utils/methods';
import { eel } from '../../utils/eel';
// import createPdf from '../helpers/editPDF';

function DisplayPDF() {
  const [pdfData, setPDFData] = useState();
  const lines = useMemo(() => {
    // console.log(JSON.stringify(JSON.stringify(pdfData)))
    console.log(JSON.parse(pdfData || '{}'));
    const array = [];
    if (Array.isArray(pdfData)) {
      pdfData.forEach((data) => {
        data.split('\n').forEach((line, index) => {
          array.push(<p key={index}>{line}</p>);
        });
      });
    } else if (pdfData) {
      pdfData.split('\n').forEach((line, index) => {
        array.push(<p key={index}>{line}</p>);
      });
    } return array;
  }, [pdfData]);

  return (
    <div className="App-intro">
      <div style={{ display: 'flex', justifyContent: 'center', height: '10vh' }}>
        <Button onClick={() => eel.getDataFromTranscript()().then((result) => {
          setPDFData(result)
          // createPdf('../DP-DataScience.pdf', '../output.pdf');
        }).catch((error) => {
          console.log(error);
          setPDFData(error.errorText && extractErrorMessage(error.errorText))
        })}>Import Transcript</Button>
      </div>
      <div style={{ padding: '50px', overflowY: 'auto', height: '40vh' }}>
        {lines}
      </div>
    </div>
  );
}

export default DisplayPDF;
