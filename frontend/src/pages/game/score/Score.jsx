import { useEffect, useState } from "react";
import axios from "axios";

import useStore from "../../../store";
import { GameResult, GameState } from "../../../constants/misc";
import { REMATCH_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";

export default function Score({
  game,
  goToLobby,
  hasRematchGame,
  joinRematchGame,
}) {
  const { user, token } = useStore((store) => store);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rematchRequestHandler = () => {
    setIsLoading(true);
    console.log("game", game.id);

    axios
      .post(REMATCH_GAME_URL + game.id, {}, authConfig(token))
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // userIsPlayer2 is false, if user is the player 2
    const userIsPlayer1 = game.player1._id === user.id;
    // playerWon is false if match ended in a draw
    const playerWon = userIsPlayer1 === (game.result === GameResult.NOUGHT_WON);
    // const playerWon = userIsPlayer1 && game.result === GameResult.NOUGHT_WON;

    const gameDraw = game.result === GameResult.DRAW;

    if (!gameDraw) {
      if (playerWon) {
        setMessage("You Won");
      } else {
        setMessage("You Lose");
      }
    } else {
      setMessage("Game is draw");
    }
  }, [game]);
  return (
    <div>
      <h2>Score</h2>
      <button onClick={goToLobby}>Back to Lobby</button>

      {hasRematchGame ? (
        <button onClick={joinRematchGame}>Join Rematch</button>
      ) : (
        <button onClick={rematchRequestHandler}>Rematch Request</button>
      )}
      <hr />
      {message}
    </div>
  );
}
