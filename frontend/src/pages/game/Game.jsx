import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Lobby from "./lobby/Lobby";
import { DOMAIN } from "../../constants/api";
import useStore from "../../store";
import Play from "./play/Play";
import { GameResult, GameState, NotificationType } from "../../constants/misc";

export default function Game() {
  const SOCKET_SERVER_URL = `${DOMAIN}/notification`;
  const [socket, setSocket] = useState(null);

  const { token } = useStore((state) => state);

  const [game, setGame] = useState(null);

  const [currentNotification, setCurrentNotification] = useState(null);

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
      if (game && game.id === currentNotification.payload.id) {
        if (
          currentNotification.type === NotificationType.PLAYER2_JOIN ||
          currentNotification.type === NotificationType.MOVE
        ) {
          setGame(currentNotification.payload);
        }
      }
    }
  }, [currentNotification]);

  /**
   * Updates the gameState according to what the result of the game is.
   */
  useEffect(() => {
    if (game) {
      console.log(game);

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

  return currentGameState === GameState.LOBBY ? (
    <Lobby setGame={setGame} />
  ) : currentGameState === GameState.PLAY ? (
    <Play game={game} setCurrentGameState={setCurrentGameState} />
  ) : currentGameState === GameState.SCORE ? (
    <>Score Page</>
  ) : (
    <>other</>
  );
}
