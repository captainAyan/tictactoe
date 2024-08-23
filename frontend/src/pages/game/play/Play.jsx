import { useEffect, useState } from "react";
import axios from "axios";

import { ADD_MOVE_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";
import Board from "./Board";

export default function Play({ game, goToLobby }) {
  const { token } = useStore((state) => state);

  // if player2 is null, then the state is waiting
  const [isPlaying, setIsPlaying] = useState(game.player1 && game.player2);

  const [isLoading, setIsLoading] = useState(false);

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
    if (!isPlaying && game.player1 && game.player2) {
      setIsPlaying(true);
    }
  }, [game]);

  return (
    <div>
      <h2>Play</h2>
      <p>{isPlaying ? "Play" : "Wait"}</p>
      <button onClick={goToLobby}>Back to Lobby</button>
      {isLoading ? "Sending move" : ""}
      <hr />
      <Board board={game.board} buttonHandler={boardButtonHandler} />
      <br />
    </div>
  );
}
