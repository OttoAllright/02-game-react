import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Square } from './components/Square.jsx';
import { TURNS} from './constants.js';
import { checkWinnerFrom, checkEndGame } from './logic/board.js';
import { WinnerModal } from './components/WinnerModal.jsx';

const URL = import.meta.env.VITE_BACKEND_URL; // Use environment variable or fallback to localhost

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null); // null means no winner, false means a tie

  // Retrieve the game state from the backend when the page loads
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`${URL}/get-game`); // Use the URL constant
        if (response.ok) {
          const data = await response.json();
          if (data.board && data.turn) {
            setBoard(data.board);
            setTurn(data.turn);
          }
        } else {
          console.error('Error retrieving the game state:', response.statusText);
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
      }
    };

    fetchGameState();
  }, []); // The empty array ensures this only runs when the component mounts

  const resetGame = async () => {
    try {
      // Request to the backend to reset the game state
      await fetch(`${URL}/reset-game`, {
        method: 'POST',
      });

      // Reset the game state in the frontend
      setBoard(Array(9).fill(null));
      setTurn(TURNS.X);
      setWinner(null);

      console.log('Game state reset successfully');
    } catch (error) {
      console.error('Error resetting game state:', error);
    }
  };

  const updateBoard = async (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    try {
      await fetch(`${URL}/save-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board: newBoard,
          turn: newTurn,
        }),
      });
      console.log('Game saved on the server');
    } catch (error) {
      console.error('Error saving the game on the server:', error);
    }

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // tie
    }
  };

  return (
    <main className="board">
      <h1 translate="no">Tic tac toe</h1>
      <button onClick={resetGame}>Reset game</button>
      <section className="game">
        {board?.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;