import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import Home from "./components/Home";
import EmployeeDetails from "./components/EmployeeDetails";
import Registration from "./components/Registration";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/employee/:id" 
                    element={
                        <ProtectedRoute>
                            <EmployeeDetails />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/register" 
                    element={
                        <ProtectedRoute>
                            <Registration />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
