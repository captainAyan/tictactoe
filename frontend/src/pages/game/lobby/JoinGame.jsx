import { useState } from "react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { BASE_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import { GameIdSchema } from "../../../util/gameIdValidationSchema";
import useStore from "../../../store";

export default function JoinGame({ setGame }) {
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useStore((state) => state);

  const handleSubmit = (data) => {
    console.log("Joining game", data);
    setIsLoading(true);

    axios
      .put(BASE_URL + "/game/join", data, authConfig(token))
      .then(({ data }) => setGame(data))
      .catch((error) => setError(error.response))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h2>Join game form</h2>

      <Formik
        initialValues={{
          gameId: "",
        }}
        validationSchema={GameIdSchema}
        onSubmit={async (values) => handleSubmit(values)}
      >
        <Form>
          <fieldset>
            <legend>Join game:</legend>
            <label htmlFor="gameId">
              <span>Game Id</span>
            </label>
            <Field type="text" name="gameId" placeholder="Game Id" autoFocus />
            <span>
              <ErrorMessage name="gameId" />
            </span>
            <button className={`${isLoading ? "loading" : ""}`} type="submit">
              Join
            </button>
          </fieldset>
        </Form>
      </Formik>

      <p>Error: {JSON.stringify(error)}</p>
    </div>
  );
}
