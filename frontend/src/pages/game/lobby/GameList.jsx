import { useEffect, useState } from "react";
import axios from "axios";

import { GET_GAME_URL, GET_GAMES_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";

export default function GameList({ setGame }) {
  const { token } = useStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [games, setGames] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(GET_GAMES_URL, authConfig(token))
      .then(({ data }) => {
        console.log(data);
        setGames(data);
      })
      .catch((error) => setErrorMessage(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchAndSetGame = (gameId) => {
    setIsLoading(true);
    axios
      .get(GET_GAME_URL + gameId, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => {
        setErrorMessage(error.response.data.error.message);
        if (error.response.status === 404)
          setGames(games.filter((game) => game.id !== gameId));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h2>Games</h2>
      {isLoading ? "Loading..." : ""}
      <p className="warning">{errorMessage}</p>

      {games.length === 0 ? (
        <h1 className="empty">No Games</h1>
      ) : (
        <div style={{ height: "256px", overflowY: "scroll" }}>
          {games.map((game) => {
            return (
              <div className="match-up" key={game.id}>
                <span
                  title={game.player1?.username}
                  className="player-name"
                  id="player1"
                >
                  {game.player1?.username || "..."}
                </span>
                <span className="vs">vs</span>
                <span
                  title={game.player2?.username}
                  className="player-name"
                  id="player1"
                >
                  {game.player2?.username || "..."}
                </span>

                <div className="btn-container">
                  <button
                    onClick={() => fetchAndSetGame(game.id)}
                    className="btn accent-btn small-btn"
                  >
                    Re-enter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
