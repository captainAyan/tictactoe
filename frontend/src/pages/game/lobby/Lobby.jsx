import JoinGame from "./JoinGame";
import CreateGame from "./CreateGame";
import GameList from "./GameList";

export default function Lobby({ setGame }) {
  return (
    <>
      <JoinGame setGame={setGame} />
      <hr />
      <CreateGame setGame={setGame} />
      <hr />
      <GameList setGame={setGame} />
    </>
  );
}
