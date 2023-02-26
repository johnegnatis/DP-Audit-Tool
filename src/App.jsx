import React, { useState } from 'react';
import './assets/styles/styles.scss';
import { eel } from './utils/eel.js';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';

function App() {
  eel.set_host('ws://localhost:8888');

  return (
    <div className="App">
      <NavigationBar />
      <HomePage />
    </div>
  );
}

export default App;
