export default function Board({ board, buttonHandler }) {
  return (
    <div>
      <button className="board-btn" onClick={() => buttonHandler(0)}>
        {board[0]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(1)}>
        {board[1]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(2)}>
        {board[2]}
      </button>
      <br />
      <button className="board-btn" onClick={() => buttonHandler(3)}>
        {board[3]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(4)}>
        {board[4]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(5)}>
        {board[5]}
      </button>
      <br />
      <button className="board-btn" onClick={() => buttonHandler(6)}>
        {board[6]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(7)}>
        {board[7]}
      </button>
      <button className="board-btn" onClick={() => buttonHandler(8)}>
        {board[8]}
      </button>
    </div>
  );
}
