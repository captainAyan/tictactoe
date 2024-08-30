import { useState } from "react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { JOIN_GAME_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import { GameIdSchema } from "../../../util/gameIdValidationSchema";
import useStore from "../../../store";

export default function JoinGame({ setGame }) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useStore((state) => state);

  const handleSubmit = (data) => {
    setIsLoading(true);
    const { gameId } = data;

    axios
      .put(JOIN_GAME_URL + gameId, {}, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => setError(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <Formik
        initialValues={{
          gameId: "",
        }}
        validationSchema={GameIdSchema}
        onSubmit={async (values) => handleSubmit(values)}
      >
        <Form>
          <fieldset>
            <legend>
              <h1>Join game</h1>
            </legend>
            <div className="form-field">
              <label htmlFor="gameId">
                <span>Game Id</span>
              </label>
              <Field
                type="text"
                name="gameId"
                placeholder="Game Id"
                autoFocus
              />
              <span className="warning">
                <ErrorMessage name="gameId" />
              </span>
            </div>

            <p className="warning">{error}</p>
            <button
              className="btn large-btn primary-btn"
              type="submit"
              disabled={isLoading}
            >
              Join
            </button>
          </fieldset>
        </Form>
      </Formik>
    </div>
  );
}
