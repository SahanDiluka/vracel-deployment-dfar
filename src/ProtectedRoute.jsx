import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../services/tokenService";

export default async function ProtectedRoute({ children }) {

  const accessToken = localStorage.getItem("access_token");

  if (!accessToken || isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  return children;
}