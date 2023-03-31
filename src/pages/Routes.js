import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import { AuthContext } from "context/AuthContext";

import Authentication from "./Authentication"
import Dashboard from "./Dashboard"
import Frontend from "./Frontend"

export default function Index() {

  const { isAuthenticated } = useContext(AuthContext)
  // const { isAuthenticated, user } = useContext(AuthContext)
  // console.log(isAuthenticated)
  // console.log(user)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Frontend />} />
        <Route path="/authentication/*" element={!isAuthenticated ? <Authentication /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard/*" element={<PrivateRoute Component={Dashboard} />} />
      </Routes>
    </BrowserRouter>
  );
}