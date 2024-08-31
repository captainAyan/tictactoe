import { useEffect, useState } from "react";
import axios from "axios";

import { ADD_MOVE_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";
import Board from "./Board";
import ScoreBoard from "../../../components/ScoreBoard";

export default function Play({ game, goToLobby }) {
  const { token, user } = useStore((state) => state);

  // if player2 is null, then the state is waiting
  const [isPlaying, setIsPlaying] = useState(game.player1 && game.player2);

  const [isLoading, setIsLoading] = useState(false);

  const [isYourTurn, setIsYourTurn] = useState(false);

  const boardButtonHandler = (position) => {
    if (isPlaying) {
      setIsLoading(true);
      console.log("game", game.id);

      axios
        .put(ADD_MOVE_GAME_URL + game.id, { position }, authConfig(token))
        .then(({ data }) => {
          console.log(data);
        })
        .catch((error) => console.log("error", error))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (game.player1 && game.player2) {
      setIsYourTurn(
        (user.id === game.player1._id && game.player1HasNextMove) ||
          (user.id === game.player2._id && !game.player1HasNextMove)
      );
    }

    if (!isPlaying && game.player1 && game.player2) {
      setIsPlaying(true);
    }
  }, [game]);

  const [isCopied, setIsCopied] = useState(false);
  const copyGameId = () => {
    navigator.clipboard.writeText(game.id).then(() => setIsCopied(true));
  };

  return (
    <>
      <ScoreBoard
        player1Name={game.player1?.username}
        player1Score={10}
        player2Name={game.player2?.username}
        player2Score={11}
      />

      <p style={{ fontFamily: "monospace", fontSize: "16px" }}>
        <b>Game ID: </b>
        <span>{game.id}</span>
      </p>

      <button
        className="btn primary-btn small-btn"
        style={{ marginRight: "8px" }}
        onClick={copyGameId}
      >
        {isCopied ? "Copied" : "Copy ID"}
      </button>
      <button className="btn accent-btn small-btn" onClick={goToLobby}>
        Back To Lobby
      </button>
      <span
        style={{ marginRight: "8px" }}
        className={`game-status ${isPlaying ? "play" : "wait"}`}
        title={isPlaying ? "Opponent has joined" : "Wait for opponent to join"}
      >
        {isPlaying ? "🚀 Play" : "⏳ Wait"}
      </span>

      {isPlaying ? (
        <span
          style={{ marginRight: "8px" }}
          className={`game-status ${
            isYourTurn ? "your-turn" : "not-your-turn"
          }`}
          title={isYourTurn ? "Your turn to play" : "Not Your turn to play"}
        >
          {isYourTurn ? "🟢 Your Turn" : "🛑 Not Your Turn"}
        </span>
      ) : null}

      <span>{isLoading ? "Loading..." : ""}</span>

      <hr />
      <Board board={game.board} buttonHandler={boardButtonHandler} />
      <br />
    </>
  );
}
