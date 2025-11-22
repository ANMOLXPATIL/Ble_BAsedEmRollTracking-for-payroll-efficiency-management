import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import EmployeeDetails from "./components/EmployeeDetails";
import NavBar from "./components/Navbar"; // Import NavBar

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomeWithNav />} />
                <Route path="/employee/:id" element={<EmployeeDetails />} />
            </Routes>
        </Router>
    );
}

// Wrapper to include NavBar in Home
function HomeWithNav() {
    return (
        <div style={{ display: "flex" }}>
            <NavBar />
            <Home />
        </div>
    );
}

export default App;
