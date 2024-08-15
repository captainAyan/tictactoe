import { Navigate } from "react-router-dom";

import useStore from "../store";

export default function AuthProtectedRoute({ children }) {
  const { token } = useStore((state) => state);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
