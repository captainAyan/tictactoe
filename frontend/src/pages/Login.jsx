import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";

import axios from "axios";
import { LOGIN_URL } from "../constants/api";
import { LoginSchema } from "../util/userValidationSchema";
import useStore from "../store";

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState();
  const [errorData, setErrorData] = useState();

  const [helperText, setHelperText] = useState("");

  const { token, user, login } = useStore((state) => state);

  useEffect(() => {
    if (errorData && !user) {
      setHelperText(errorData.message);
    }

    if (responseData && !user) {
      localStorage.setItem("token", responseData.token);
      const { token, ...user } = responseData;

      login(user, token);
    }

    if (token && user) {
      navigate("/");
    }
  }, [user, token, errorData, responseData, navigate, login]);

  const handleSubmit = (userData) => {
    setIsLoading(true);
    axios
      .post(LOGIN_URL, userData)
      .then(({ data }) => setResponseData(data))
      .catch((error) => setErrorData(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h1>Login</h1>

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => handleSubmit(values)}
      >
        <Form>
          <fieldset>
            <legend>Login:</legend>
            <label htmlFor="username">
              <span>Username</span>
            </label>
            <Field
              type="text"
              name="username"
              placeholder="Username"
              autoFocus
            />
            <span>
              <ErrorMessage name="username" />
            </span>
            <br />
            <label htmlFor="password">
              <span>Password</span>
            </label>
            <Field type="password" name="password" placeholder="Password" />
            <span>
              <ErrorMessage name="password" />
            </span>

            <p>{helperText}</p>

            <div>
              <button className={`${isLoading ? "loading" : ""}`} type="submit">
                Login
              </button>
            </div>
          </fieldset>
        </Form>
      </Formik>

      <div>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
