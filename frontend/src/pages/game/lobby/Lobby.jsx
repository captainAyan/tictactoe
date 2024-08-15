import { useEffect, useState } from "react";
import axios from "axios";

import JoinGame from "./JoinGame";
import CreateGame from "./CreateGame";
import useStore from "../../../store";
import { GET_GAMES_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";

const Lobby = ({ setGame }) => {
  const { token } = useStore((state) => state);

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div>
      <h1>Lobby</h1>
      <hr />
      <JoinGame setGame={setGame} />
      <CreateGame setGame={setGame} />

      <hr />
      {isLoading ? "Loading Your Game List" : ""}
      <>
        {games.map((game) => {
          return (
            <p key={game.id}>
              <span>{game.id} = </span>
              <a href="#" onClick={() => setGame(game)}>
                Join
              </a>
            </p>
          );
        })}
      </>
    </div>
  );
};

export default Lobby;
