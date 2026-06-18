import React, { useState } from "react";
import "./styles.css";

type Player = "X" | "O";
type Cell = Player | null;

const winningCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));

  const [isXTurn, setIsXTurn] = useState(true);

  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  const calculateWinner = (squares: Cell[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;

      if (
        squares[a] !== null &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return {
          winner: squares[a] as Player,
          line: combo,
        };
      }
    }

    return null;
  };

  const winnerInfo = calculateWinner(board);

  const winner = winnerInfo ? winnerInfo.winner : null;

  const winningLine = winnerInfo ? winnerInfo.line : [];

  const isDraw = winner === null && board.every((cell) => cell !== null);

  const handleClick = (index: number) => {
    if (board[index] !== null || winner !== null) {
      return;
    }

    const updatedBoard = [...board];

    updatedBoard[index] = isXTurn ? "X" : "O";

    setBoard(updatedBoard);

    const result = calculateWinner(updatedBoard);

    if (result) {
      const winnerPlayer: Player = result.winner;

      setScores((prev) => ({
        ...prev,
        [winnerPlayer]: prev[winnerPlayer] + 1,
      }));
    } else if (updatedBoard.every((cell) => cell !== null)) {
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    }

    setIsXTurn((prev) => !prev);
  };

  const restartRound = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  const resetEverything = () => {
    setBoard(Array(9).fill(null));

    setIsXTurn(true);

    setScores({
      X: 0,
      O: 0,
      draws: 0,
    });
  };

  let statusMessage = "";

  if (winner !== null) {
    statusMessage = "Player " + winner + " Wins!";
  } else if (isDraw) {
    statusMessage = "It's a Draw!";
  } else {
    statusMessage = "Player " + (isXTurn ? "X" : "O") + "'s Turn";
  }

  return (
    <div className="app">
      <div className="game-card">
        <h1 className="title">Neon Tic Tac Toe</h1>

        <p className="subtitle">Premium React + TypeScript Edition</p>

        <div className="scoreboard">
          <div className="score-box">
            <span>X</span>
            <strong>{scores.X}</strong>
          </div>

          <div className="score-box">
            <span>Draws</span>
            <strong>{scores.draws}</strong>
          </div>

          <div className="score-box">
            <span>O</span>
            <strong>{scores.O}</strong>
          </div>
        </div>

        <div className="status">{statusMessage}</div>

        <div className="board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={winningLine.includes(index) ? "cell winning" : "cell"}
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="controls">
          <button className="action-btn" onClick={restartRound}>
            New Round
          </button>

          <button className="action-btn reset" onClick={resetEverything}>
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
