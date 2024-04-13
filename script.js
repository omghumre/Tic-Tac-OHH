const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const resetButton = document.getElementById('reset-button');

const PLAYER_X = 'X';
const PLAYER_O = 'O';

let currentPlayer = PLAYER_X;
let board = Array(9).fill('');
let moveQueue = [];

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function checkWinner(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function handleCellClick(e) {
    const cellIndex = e.target.getAttribute('data-index');

    if (board[cellIndex] !== '') {
        return;
    }

    board[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('retro-text');

    moveQueue.push(cellIndex);

    if (moveQueue.length > 6) {
        const oldMove = moveQueue.shift();
        board[oldMove] = '';
        cells[oldMove].textContent = '';
        cells[oldMove].classList.remove('retro-text', 'vanishing');

        const nextMoveIndex = moveQueue[0];
        cells[nextMoveIndex].classList.add('vanishing'); // Add vanishing class
    }

    if (checkWinner(currentPlayer)) {
        winningAnimation(currentPlayer);
        setTimeout(() => {
            resetGame();
        }, 2000);
    } else {
        currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        currentPlayerDisplay.textContent = currentPlayer;
    }
}

function winningAnimation(player) {
    const winnerCells = board.reduce((acc, cell, index) => {
        if (cell === player) acc.push(index);
        return acc;
    }, []);

    winnerCells.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function resetGame() {
    board = Array(9).fill('');
    currentPlayer = PLAYER_X;
    moveQueue = [];
    currentPlayerDisplay.textContent = currentPlayer;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('retro-text', 'winner', 'disappearing', 'vanishing');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);