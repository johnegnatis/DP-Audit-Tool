import React from "react";
import "./assets/styles/styles.scss";
import { eel } from "./utils/eel.js";
import NavigationBar from "./components/NavigationBar";
import Router from "./components/Router";

function App() {
  eel.set_host("ws://localhost:8888");

  return (
    <React.StrictMode>
      <NavigationBar />
      <Router />
    </React.StrictMode>
  );
}

export default App;
