import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Lobby from "./lobby/Lobby";
import { DOMAIN } from "../../constants/api";
import useStore from "../../store";
import Play from "./play/Play";
import { GameState } from "../../constants/misc";

export default function Game() {
  const SOCKET_SERVER_URL = `${DOMAIN}/notification`;
  const [socket, setSocket] = useState(null);

  const { token } = useStore((state) => state);

  const [game, setGame] = useState(null);

  const [currentNotification, setCurrentNotification] = useState(null);
  const NotificationType = {
    PLAYER2_JOIN: "player2_join",
  };

  // States
  /// Lobby - You can join or create a game
  /// Play  - You're playing
  /// Score - game is over, and score is being displayed
  const [currentGameState, setCurrentGameState] = useState(GameState.LOBBY);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token: "Bearer " + token },
    });

    setSocket(newSocket);

    // Clean up the connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Handle connection event
      socket.on("connect", () => {
        console.log("Connected to the server with socket ID:", socket.id);
      });

      // Handle disconnect event
      socket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });

      // Handle connection error event
      socket.on("connect_error", (err) => {
        console.log("Connection error:", err.message);
      });

      socket.on("notification", notificationHandler);

      return () => {
        if (socket) {
          socket.off("notification", notificationHandler);
        }
      };
    }
  }, [socket]);

  const notificationHandler = (data) => {
    console.log("WS Notification", data);
    setCurrentNotification(data);

    if (data.type === NotificationType.PLAYER2_JOIN) {
      if (data.payload.player1 && data.payload.player2) {
        setCurrentNotification(data);
      }
    }
  };

  useEffect(() => {
    if (game) setCurrentGameState(GameState.PLAY);
  }, [game]);

  useEffect(() => {
    if (currentNotification) {
      if (
        currentNotification.type === NotificationType.PLAYER2_JOIN ||
        currentNotification.type === NotificationType.MOVE
      ) {
        if (game && game.id === currentNotification.payload.id) {
          setGame(currentNotification.payload);
        }
      }
    }
  }, [currentNotification]);

  return currentGameState === GameState.LOBBY ? (
    <Lobby setGame={setGame} />
  ) : currentGameState === GameState.PLAY ? (
    <Play game={game} setCurrentGameState={setCurrentGameState} />
  ) : (
    <></>
  );
}
