import Avatar from "../../../components/Avatar";

import useStore from "../../../store";

export default function Profile() {
  const { user } = useStore((state) => state);

  return (
    <div>
      <h2>Profile</h2>
      <center>
        <Avatar
          width={15}
          cell={9}
          color={"#8692f7"}
          seed={user?.id}
          className="avatar"
        />
        <h1 style={{ margin: "20px 0px 0px 0px" }}>{user?.username}</h1>

        <p style={{}}>{user?.id}</p>
      </center>
    </div>
  );
}
