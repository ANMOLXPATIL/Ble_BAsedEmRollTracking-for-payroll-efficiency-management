import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import EmployeeDetails from "./components/EmployeeDetails";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
        </Routes>
      </Router>
  );
}

export default App;