import React from "react";
import "./assets/styles/styles.scss";
import { eel } from "./utils/eel.js";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./components/HomePage";
import { path } from "./utils/constants";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={path.homePage} element={<HomePage />} />
    </Route>
  )
);

function App() {
  eel.set_host("ws://localhost:8888");

  return (
    <React.StrictMode>
      <NavigationBar />
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
