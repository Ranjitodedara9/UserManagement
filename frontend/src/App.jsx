import React from "react";
import Ragistration from "./components/Ragistration";
import { Routes, Route } from "react-router";
import Login from "./components/Login";
import Profile from "./components/Profile";
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Ragistration />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </div>
  );
};

export default App;

