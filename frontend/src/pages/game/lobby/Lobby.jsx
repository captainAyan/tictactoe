import JoinGame from "./JoinGame";
import CreateGame from "./CreateGame";
import GameList from "./GameList";
import { useState } from "react";
import Profile from "./Profile";

export default function Lobby({ setGame }) {
  // Tabs
  /// NEW     - Create or Join a new Game
  /// GAMES   - Join created games
  /// PROFILE - View your profile
  const Tab = { NEW: "n", GAMES: "g", PROFILE: "p" };
  const [currentTab, setCurrentTab] = useState(Tab.NEW);

  return (
    <>
      <div className="tab-btn-container">
        <button
          className={`btn tab-btn ${currentTab === Tab.NEW && "active"}`}
          onClick={() => setCurrentTab(Tab.NEW)}
        >
          New
        </button>
        <button
          className={`btn tab-btn ${currentTab === Tab.GAMES && "active"}`}
          onClick={() => setCurrentTab(Tab.GAMES)}
        >
          Games
        </button>
        <button
          className={`btn tab-btn ${currentTab === Tab.PROFILE && "active"}`}
          onClick={() => setCurrentTab(Tab.PROFILE)}
        >
          Profile
        </button>
      </div>
      {currentTab === Tab.NEW && (
        <>
          <JoinGame setGame={setGame} />
          <hr />
          <CreateGame setGame={setGame} />
        </>
      )}

      {currentTab === Tab.GAMES && <GameList setGame={setGame} />}

      {currentTab === Tab.PROFILE && <Profile />}
    </>
  );
}
