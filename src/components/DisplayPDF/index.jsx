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
        <Upload
          name="file"
          maxCount={1}
          onChange={(info) => {
            // TODO: find out how to extract real path from file obj
            // TODO: set loading to stop, no need to load
            eel.getDataFromTranscript(info.file.name)()
              .then((result) => {
                setPDFData(result);
              }).catch(() => {
                setPDFData('File not found. Make sure that the pdf is in the same directory as ./src');
              });
          }}
          customRequest={() => {}}
        >
          <Button icon={<UploadOutlined />}>
            Click to Upload a PDF ( place pdf in ./project )
          </Button>
        </Upload>
      </div>
      <div style={{ padding: '50px', overflowY: 'auto', height: '40vh' }}>
        {lines}
      </div>
    </div>
  );
}

export default DisplayPDF;
