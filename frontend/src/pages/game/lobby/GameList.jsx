import { useEffect, useState } from "react";
import axios from "axios";

import { GET_GAME_URL, GET_GAMES_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";

export default function GameList({ setGame }) {
  const { token } = useStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const [games, setGames] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(GET_GAMES_URL, authConfig(token))
      .then(({ data }) => {
        console.log(data);
        setGames(data);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchAndSetGame = (gameId) => {
    setIsLoading(true);
    axios
      .get(GET_GAME_URL + gameId, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      {games?.length !== 0 ? <h2>Games</h2> : null}
      {isLoading ? "Loading..." : ""}
      <>
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
      </>
    </div>
  );
}
