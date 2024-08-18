import "./App.css";
import { useEffect } from "react";
import axios from "axios";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Game from "./pages/game/Game";

import AuthProtectedRoute from "./components/AuthProtectedRoute";
import { GET_PROFILE_URL } from "./constants/api";
import authConfig from "./util/authConfig";
import useStore from "./store";

export default function App() {
  const { token, login, logout } = useStore((state) => state);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    logout();
  };

  useEffect(() => {
    // syncing user
    if (token)
      axios
        .get(GET_PROFILE_URL, authConfig(token))
        .then(({ data }) => {
          login(data, token);
        })
        .catch(() => {
          localStorage.setItem("token", "");
          logout();
        });
  }, [token, login, logout]);

  return (
    <BrowserRouter>
      <nav>
        {token ? <button onClick={handleLogout}>Logout</button> : <></>}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/game" replace />} />
        <Route
          path="/game"
          element={
            <AuthProtectedRoute>
              <Game />
            </AuthProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
