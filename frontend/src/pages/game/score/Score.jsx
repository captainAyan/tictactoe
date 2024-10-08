import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";

import useStore from "../../../store";
import { GameResult } from "../../../constants/misc";
import { REMATCH_GAME_URL, JOIN_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import ScoreBoard from "../../../components/ScoreBoard";

export default function Score({ game, goToLobby }) {
  const { user, token } = useStore((store) => store);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [hasConfettiBeenShown, setHasConfettiBeenShown] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const rematchRequestHandler = () => {
    setIsLoading(true);
    console.log("starting rematch game", game.id);

    axios
      .post(REMATCH_GAME_URL + game.id, {}, authConfig(token))
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => setErrorMessage(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  const joinRematchHandler = () => {
    setIsLoading(true);

    console.log("joining rematch");

    axios
      .put(JOIN_GAME_URL + game.rematch.newGameId, {}, authConfig(token))
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => setErrorMessage(error.response.data.error.message))
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

      if (gameDraw) setMessage("Game is Draw");
      else if (playerWon) setMessage("You Won 🎉");
      else setMessage("You Lose 😥");

      if (playerWon && !gameDraw && !hasConfettiBeenShown) {
        setHasConfettiBeenShown(true);
        triggerConfetti();
      }
    }
  }, [game]);

  return (
    <>
      <ScoreBoard
        player1Name={game.player1?.username}
        player1Score={game.sessionData?.score[game.player1?._id]}
        player2Name={game.player2?.username}
        player2Score={game.sessionData?.score[game.player2?._id]}
        userIsPlayer1={game.player1?._id === user.id}
      />
      <h1 className="result-message">{message}</h1>
      <p className="warning">{errorMessage}</p>

      {game.rematch.newGameId && <p>Rematch has been requested</p>}

      {game.rematch.newGameId ? (
        <button
          onClick={joinRematchHandler}
          disabled={isLoading}
          className="btn primary-btn large-btn"
        >
          Join Rematch
        </button>
      ) : (
        <button
          onClick={rematchRequestHandler}
          disabled={isLoading}
          className="btn primary-btn large-btn"
        >
          Rematch Request
        </button>
      )}
      <button className="btn accent-btn large-btn" onClick={goToLobby}>
        Back to Lobby
      </button>
    </>
  );
}
