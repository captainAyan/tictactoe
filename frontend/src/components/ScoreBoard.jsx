export default function ScoreBoard({
  player1Name,
  player1Score,
  player2Name,
  player2Score,
  userIsPlayer1,
}) {
  return (
    <div className="scoreboard">
      <div className={`player ${userIsPlayer1 ? "user" : ""}`}>
        <p className="player-name" title={`${player1Name || "..."} (O)`}>
          {player1Name || "..."}
        </p>
        <p className="player-score">{player1Score}</p>
      </div>
      <span className="vs">vs</span>

      <div className={`player ${!userIsPlayer1 ? "user" : ""}`}>
        <p className="player-name" title={`${player2Name || "..."} (X)`}>
          {player2Name || "..."}
        </p>
        <p className="player-score">{player2Score}</p>
      </div>
    </div>
  );
}
