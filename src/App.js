import React, { useMemo, useState } from "react";
import logo from "./logo.png";
import "./App.css";
import { Button, Upload } from 'antd';
import { eel } from "./eel.js";
import { UploadOutlined } from '@ant-design/icons';

async function getPDFData(path) {
  return await eel.getPDFData(path)()
}

const App = () => { 
    const [pdfData, setPDFData] = useState();
    eel.set_host("ws://localhost:8888");
    const lines = useMemo(() => {
      const array = [];
      if (Array.isArray(pdfData)) {
        pdfData.forEach((data) => {
          data.split('\n').forEach((line, index) => {
            array.push(<p key={index}>{line}</p>);
          })
        })
      } else if (pdfData) {
        pdfData.split('\n').forEach((line, index) => {
          array.push(<p key={index}>{line}</p>);
        })
      } return array;
    }, [pdfData])

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome Team!</h1>
        </header>
        <div className="App-intro">
        <div style={{ display: 'flex', justifyContent:'center', height: '10vh'}}>
          <Upload
            name="file"
            maxCount={1}
            onChange={(info) => {
              // TODO: find out how to extract real path from file obj
              // TODO: set loading to stop, no need to load
              getPDFData(info.file.name)
                .then(result => {
                  setPDFData(result);
                }).catch(() => {
                  setPDFData('ERROR');
                });
            }}
            customRequest={() => {}}
          >
            <Button icon={<UploadOutlined />}>Click to Upload a PDF ( place pdf in ./project )</Button>
          </Upload>
        </div>
        <div style={{ padding: '50px', overflowY: 'auto', height: '40vh'}}>
          {lines}
        </div>
        </div>
      </div>
    );
}

export default App;
