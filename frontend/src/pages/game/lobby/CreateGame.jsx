import { useState } from "react";
import axios from "axios";

import { BASE_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import useStore from "../../../store";

export default function CreateGame({ setGame }) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useStore((state) => state);

  const handleCreateGame = () => {
    setIsLoading(true);

    axios
      .post(BASE_URL + "/game", {}, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => setErrorMessage(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h2>Create Game</h2>
      <p className="warning">{errorMessage}</p>
      <button
        className={`btn primary-btn`}
        disabled={isLoading}
        onClick={handleCreateGame}
      >
        Create
      </button>
    </div>
  );
}
