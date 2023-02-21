import React, { useMemo, useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { eel } from '../../utils/eel';

function DisplayPDF() {
  const [pdfData, setPDFData] = useState();
  const lines = useMemo(() => {
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
        }).catch((error) => {
          console.log('error: ' + error);
        })}>Select PDF</Button>
      </div>
      <div style={{ padding: '50px', overflowY: 'auto', height: '40vh' }}>
        {lines}
      </div>
    </div>
  );
}

export default DisplayPDF;
