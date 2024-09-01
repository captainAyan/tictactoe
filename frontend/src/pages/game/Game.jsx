import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Lobby from "./lobby/Lobby";
import Play from "./play/Play";
import Score from "./score/Score";
import { DOMAIN } from "../../constants/api";
import useStore from "../../store";
import { GameResult, GameState, NotificationType } from "../../constants/misc";

export default function Game() {
  const SOCKET_SERVER_URL = `${DOMAIN}/notification`;
  const [socket, setSocket] = useState(null);
  const { token, logout } = useStore((state) => state);

  const [game, setGame] = useState(null);

  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentGameState, setCurrentGameState] = useState(GameState.LOBBY);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    logout();
  };

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token: "Bearer " + token },
      transports: ["websocket"],
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
        window.alert(`WebSocket Error: ${err.message}`);
      });

      socket.on("notification", notificationHandler);

      return () => {
        if (socket) {
          socket.off("notification", notificationHandler);
        }
      };
    }
  }, [socket]);

  /**
   * Notification handler sets the latest notification to currentNotification
   */
  const notificationHandler = (data) => {
    console.log("WS Notification", data);

    setCurrentNotification(data);
  };

  /**
   * If the notication is related to current game, and the notification is for
   * player 2's joining or a move by a player, then the payload will be set to
   * the game state
   */
  useEffect(() => {
    if (currentNotification) {
      console.log("handling notif");

      if (
        currentNotification.type === NotificationType.PLAYER_JOIN &&
        game &&
        (game.id === currentNotification.payload.id ||
          game.rematch.gameId === currentNotification.payload.id)
      ) {
        /// normal joining
        console.log("normal join");
        console.log("setting game to ", currentNotification.payload);
        setGame(currentNotification.payload);
      } else if (
        currentNotification.type === NotificationType.MOVE &&
        game &&
        game.id === currentNotification.payload.id
      ) {
        /// adding move
        console.log("add move");
        setGame(currentNotification.payload);
      } else if (
        currentNotification.type === NotificationType.REMATCH_RESPONSE &&
        game &&
        game.id === currentNotification.payload.rematch.originalGameId
      ) {
        console.log("joining initiated rematch");
        setGame(currentNotification.payload);
      } else if (
        currentNotification.type === NotificationType.REMATCH_REQUEST &&
        game &&
        game.id === currentNotification.payload.id
      ) {
        console.log("received request of rematch");
        setGame(currentNotification.payload);
      }
    }
  }, [currentNotification]);

  /**
   * Updates the gameState according to what the result of the game is.
   */
  useEffect(() => {
    if (game) {
      console.log("updating game state");
      if (game.result === GameResult.PENDING) {
        setCurrentGameState(GameState.PLAY);
      } else {
        setCurrentGameState(GameState.SCORE);
      }
    }
  }, [game]);

  useEffect(() => {
    /**
     * This makes sure that when the player comes back to the lobby, the game
     * gets set to null. (otherwise the player will be taken back to the board
     * when a MOVE notification has been received for that game, even after
     * coming back to lobby)
     */
    if (currentGameState === GameState.LOBBY) setGame(null);
  }, [currentGameState]);

  const goToLobby = () => setCurrentGameState(GameState.LOBBY);

  return (
    <div className="section">
      <div className="header">
        <h2>
          {currentGameState === GameState.LOBBY
            ? "Lobby"
            : currentGameState === GameState.PLAY
            ? "Play"
            : currentGameState === GameState.SCORE
            ? "Score"
            : null}
        </h2>
        <button className="btn primary-btn small-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <hr />
      <div>
        {currentGameState === GameState.LOBBY ? (
          <Lobby setGame={setGame} />
        ) : currentGameState === GameState.PLAY ? (
          <Play game={game} goToLobby={goToLobby} />
        ) : currentGameState === GameState.SCORE ? (
          <Score setGame={setGame} game={game} goToLobby={goToLobby} />
        ) : null}
      </div>
    </div>
  );
}
