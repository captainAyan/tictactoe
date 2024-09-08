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
  const [errorMessage, setErrorMessage] = useState();

  const { token, user, login } = useStore((state) => state);

  useEffect(() => {
    if (responseData && !user) {
      localStorage.setItem("token", responseData.token);
      const { token, ...user } = responseData;

      login(user, token);
    }

    if (token && user) {
      navigate("/");
    }
  }, [user, token, responseData, navigate, login]);

  const handleSubmit = (userData) => {
    setIsLoading(true);
    axios
      .post(LOGIN_URL, userData)
      .then(({ data }) => setResponseData(data))
      .catch((error) => setErrorMessage(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="section">
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
              {/* <legend className="large">Login</legend> */}
              <legend>
                <h1>Login</h1>
              </legend>

              <div className="form-field">
                <label htmlFor="username">
                  <span>Username</span>
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoFocus
                />
                <span className="warning">
                  <ErrorMessage name="username" />
                </span>
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  <span>Password</span>
                </label>
                <Field type="password" name="password" placeholder="Password" />
                <span className="warning">
                  <ErrorMessage name="password" />
                </span>
              </div>

              <p className="warning">{errorMessage}</p>

              <button
                className="btn large-btn primary-btn"
                type="submit"
                disabled={isLoading}
              >
                Login
              </button>
            </fieldset>
          </Form>
        </Formik>
      </div>
      <p className="register-link">
        Don&apos;t have an Account?&nbsp;
        <Link to="/register" className="primary-link">
          Sign Up
        </Link>
      </p>
    </>
  );
}
