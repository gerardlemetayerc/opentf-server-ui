import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();
  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }
  return children;
}
