export default function Board({ board, buttonHandler }) {
  const tempArr = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="board-btn-container">
      <div className="board-btn-wrapper">
        {tempArr.map((i) => (
          <button
            key={i}
            className="btn board-btn primary-btn"
            onClick={() => buttonHandler(i)}
          >
            {board[i]}
          </button>
        ))}
      </div>
    </div>
  );
}
