import React from 'react';
import logo from './assets/images/logo.png';
import './assets/styles/styles.scss';
import { eel } from './utils/eel.js';
import DisplayPDF from './components/DisplayPDF';

function App() {
  eel.set_host('ws://localhost:8888');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome Team!</h1>
      </header>
      <DisplayPDF />
    </div>
  );
}

export default App;
