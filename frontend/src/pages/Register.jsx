import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";

import axios from "axios";
import { REGISTER_URL } from "../constants/api";
import { RegisterSchema } from "../util/userValidationSchema";
import useStore from "../store";

export default function Register() {
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
      .post(REGISTER_URL, userData)
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
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values) => handleSubmit(values)}
        >
          <Form>
            <fieldset>
              <legend>
                <h1>Register</h1>
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

              <div className="form-field">
                <label htmlFor="confirmPassword">
                  <span>Confirm Password</span>
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />
                <span className="warning">
                  <ErrorMessage name="confirmPassword" />
                </span>
              </div>

              <p className="warning">{errorMessage}</p>

              <button
                className={`${
                  isLoading ? "loading" : ""
                } btn large-btn primary-btn`}
                type="submit"
              >
                Register
              </button>
            </fieldset>
          </Form>
        </Formik>
      </div>
      <p className="register-link">
        Already have an Account?&nbsp;
        <Link to="/login" className="primary-link">
          Log In
        </Link>
      </p>
    </>
  );
}
