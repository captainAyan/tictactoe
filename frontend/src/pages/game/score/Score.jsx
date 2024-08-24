import { useEffect, useState } from "react";
import axios from "axios";

import useStore from "../../../store";
import { GameResult } from "../../../constants/misc";
import { REMATCH_GAME_URL, JOIN_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";

export default function Score({ game, goToLobby, rematchGame }) {
  const { user, token } = useStore((store) => store);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rematchRequestHandler = () => {
    setIsLoading(true);
    console.log("starting rematch game", game.id);

    axios
      .post(REMATCH_GAME_URL + game.id, {}, authConfig(token))
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  const joinRematchHandler = () => {
    setIsLoading(true);

    console.log("joining rematch");

    axios
      .put(JOIN_GAME_URL + rematchGame.id, {}, authConfig(token))
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  // this use effect determines the victory/defeat message
  useEffect(() => {
    if (game.result !== GameResult.PENDING) {
      // userIsPlayer2 is false, if user is the player 2
      const userIsPlayer1 = game.player1._id === user.id;
      // playerWon is false if match ended in a draw
      const playerWon =
        userIsPlayer1 === (game.result === GameResult.NOUGHT_WON);

      const gameDraw = game.result === GameResult.DRAW;

      if (!gameDraw) {
        if (playerWon) setMessage("You Won");
        else setMessage("You Lose");
      } else setMessage("Game is draw");
    }
  }, [game]);

  return (
    <div>
      <h2>Score</h2>
      <button onClick={goToLobby}>Back to Lobby</button>

      {rematchGame ? (
        <button onClick={joinRematchHandler}>Join Rematch</button>
      ) : (
        <button onClick={rematchRequestHandler}>Rematch Request</button>
      )}

      {isLoading ? "Sending move" : ""}
      <hr />
      {message}
    </div>
  );
}
