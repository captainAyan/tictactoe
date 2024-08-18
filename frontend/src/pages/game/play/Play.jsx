import { useEffect, useState } from "react";
import axios from "axios";

import { GameState } from "../../../constants/misc";
import { ADD_MOVE_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";

export default function Play({ game, setCurrentGameState }) {
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
      <p>{JSON.stringify(game)}</p>
      <p>{isPlaying ? "Play" : "Wait"}</p>
      <button onClick={() => setCurrentGameState(GameState.LOBBY)}>
        Back to Lobby
      </button>
      {isLoading ? "Sending move" : ""}
      <hr />
      <button className="board-btn" onClick={() => boardButtonHandler(0)}>
        {game.board[0]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(1)}>
        {game.board[1]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(2)}>
        {game.board[2]}
      </button>
      <br />
      <button className="board-btn" onClick={() => boardButtonHandler(3)}>
        {game.board[3]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(4)}>
        {game.board[4]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(5)}>
        {game.board[5]}
      </button>
      <br />
      <button className="board-btn" onClick={() => boardButtonHandler(6)}>
        {game.board[6]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(7)}>
        {game.board[7]}
      </button>
      <button className="board-btn" onClick={() => boardButtonHandler(8)}>
        {game.board[8]}
      </button>
      <br />
    </div>
  );
}
