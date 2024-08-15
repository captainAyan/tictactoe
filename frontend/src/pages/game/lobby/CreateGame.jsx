import { useState } from "react";
import axios from "axios";

import { BASE_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";

export default function CreateGame({ setGame }) {
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useStore((state) => state);

  const handleCreateGame = () => {
    setIsLoading(true);

    axios
      .post(BASE_URL + "/game", {}, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h2>Create Game</h2>
      <button
        className={`${isLoading ? "loading" : ""}`}
        onClick={handleCreateGame}
      >
        Create Game
      </button>
      <br />
      Error: {JSON.stringify(error, 2)}
    </div>
  );
}
