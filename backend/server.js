import express from 'express';
import { PORT, FRONTEND_URL } from './config.js';
import cors from 'cors';

const app = express();

app.use(cors({ origin: FRONTEND_URL })); // Use FRONTEND_URL from config.js
app.use(express.json());

let gameState = {
  board: Array(9).fill(null), // Empty board
  turn: 'X', // Initial turn
};

// Endpoint to verify that the server is running
app.get('/', (req, res) => {
  console.log('Server listening frontend');
  res.send('Server online');
});

// Endpoint to save the game state
app.post('/save-game', (req, res) => {
  const { board, turn } = req.body; // Extract data from the request body
  gameState = { board, turn }; // Update the game state
  console.log('Game state saved:', gameState);
  res.status(200).json({ message: 'Game saved successfully' });
});

// Endpoint to get the game state
app.get('/get-game', (req, res) => {
  res.status(200).json(gameState); // Return the game state
});

// Endpoint to reset the game state
app.post('/reset-game', (req, res) => {
  gameState = {
    board: Array(9).fill(null), // Empty board
    turn: 'X', // Initial turn
  };
  console.log('Game state reset:', gameState);
  res.status(200).json({ message: 'Game state reset successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`The server is listening on http://localhost:${PORT}`);
});






//old
// app.get('/', function (req,res){
//     res.send('hello world')
// })