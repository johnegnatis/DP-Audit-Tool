import React from "react";
import "./assets/styles/styles.scss";
import { eel } from "./utils/eel.js";
import NavigationBar from "./components/NavigationBar";
import Router from "./components/Router";
import { message } from "antd";

function App() {
  eel.set_host("ws://localhost:8888");
  const [_, contextHolder] = message.useMessage();
  return (
    <React.StrictMode>
      {contextHolder}
      <Router />
    </React.StrictMode>
  );
}

export default App;
