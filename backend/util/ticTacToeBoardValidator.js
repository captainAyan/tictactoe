/**
 * tic-tac-toe board
 *
 * 0|1|2
 * 3|4|5
 * 6|7|8
 */

const winPossibilities = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 *
 * @param {Array} board
 * @returns "o" | "x" | false (false if no one has won)
 */
module.exports = function validate(board) {
  let returnValue = false;

  winPossibilities.forEach((winPossibility) => {
    if (
      board[winPossibility[0]] === board[winPossibility[1]] &&
      board[winPossibility[0]] === board[winPossibility[2]]
    ) {
      returnValue = board[winPossibility[0]];
    }
  });

  return returnValue;
};
