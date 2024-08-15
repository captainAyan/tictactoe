import { useEffect, useState } from "react";

import { GameState } from "../../../constants/misc";

export default function Play({ game, setCurrentGameState }) {
  // if player2 is null, then the state is waiting
  const [isPlaying, setIsPlaying] = useState(game.player1Id && game.player2Id);

  useEffect(() => {
    if (!isPlaying && game.player1 && game.player2) {
      setIsPlaying(true);
    }
  }, [game]);

  return (
    <div>
      <h2>Play</h2>
      <p>{JSON.stringify(game)}</p>
      <p>{isPlaying ? "Play" : "Wait"}</p>
      <button onClick={() => setCurrentGameState(GameState.LOBBY)}>
        Back to Lobby
      </button>
      <hr />
      <button>?</button>
      <button>?</button>
      <button>?</button>
      <br />
      <button>?</button>
      <button>?</button>
      <button>?</button>
      <br />
      <button>?</button>
      <button>?</button>
      <button>?</button>
      <br />
    </div>
  );
}
