import { useState } from "react";
import axios from "axios";

import { DELETE_PROFILE_URL } from "../../../constants/api";
import authConfig from "../../../util/authConfig";
import Avatar from "../../../components/Avatar";
import ConfirmationButton from "../../../components/ConfirmationButton";
import useStore from "../../../store";

export default function Profile() {
  const { user, token, logout } = useStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    logout();
  };

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .delete(DELETE_PROFILE_URL, authConfig(token))
      .then(({ data }) => {
        if (user.id === data.id) handleLogout();
        else setErrorMessage("Unknown error");
      })
      .catch((error) => setErrorMessage(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-container">
        <Avatar
          width={15}
          cell={9}
          color={"#8692f7"}
          seed={user?.id}
          className="avatar"
        />
        <h1 className="username">{user?.username}</h1>
        <p className="user-id">{user?.id}</p>
      </div>

      {isLoading && "Loading..."}
      <p className="warning">{errorMessage}</p>

      <ConfirmationButton
        normalLabel="Delete Account"
        confirmationLabel="Confirm Deletion"
        confirmationHandler={handleSubmit}
        waitTime={5}
        className="btn large-btn danger-btn"
      />
    </div>
  );
}
