import "./App.css";
import { useEffect } from "react";
import axios from "axios";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
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
          handleLogout();
        });
  }, [token, login, logout]);

  return (
    <div className="container">
      <div className="wrapper">
        <BrowserRouter>
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
            <Route path="register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
