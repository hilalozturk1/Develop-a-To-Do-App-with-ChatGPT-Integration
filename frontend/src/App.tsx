import "./App.css";

import React, { JSX } from "react";

import Login from "./pages/Login";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Todos from "./pages/Todos";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <Todos />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
