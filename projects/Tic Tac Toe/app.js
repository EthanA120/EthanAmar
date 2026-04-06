const buttons = Array.from(document.getElementsByClassName("cell"));
const currentPlayerDiv = document.getElementsByClassName("current-player")[0];
const statusText = document.getElementsByClassName("status-text")[0];

let currentSign = "X";
let board = ["", "", "", "", "", "", "", "", ""];

currentPlayerDiv.textContent = currentSign;

buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        makeMove(btn, index);
        checkVictory();
    });
});

function makeMove(button, index) {
    if (button.innerText) return; // Bail out if cell is full already
    button.innerText = board[index] = currentSign; // Put sign in the selected cell and record it in board array
    currentSign = currentSign === "X" ? "O" : "X"; // Change sign
    currentPlayerDiv.textContent = currentSign;
}

function resetGame() {
    buttons.forEach(btn => {
        btn.innerText = ""; // Remove signs from cells
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // Resets background color
    })
    board = ["", "", "", "", "", "", "", "", ""]; // remove signs from board array
    statusText.innerText = "תור נוכחי";
    currentPlayerDiv.textContent = "X";
    buttons.forEach(btn => btn.disabled = false); // Enable buttons again
}

function checkVictory() {
    // First check if first cell in a line is signed, then check if line is equal, returns sign and line
    if (board[0] && board[0] === board[1] && board[1] === board[2]) endGame(buttons.slice(0, 3)); // 1st row
    if (board[3] && board[3] === board[4] && board[4] === board[5]) endGame(buttons.slice(3, 6)); // 2nd row
    if (board[6] && board[6] === board[7] && board[7] === board[8]) endGame(buttons.slice(6, 9)); // 3rd row
    if (board[0] && board[0] === board[3] && board[3] === board[6]) endGame([0, 3, 6].map(i => buttons[i])); // 1st culomn
    if (board[1] && board[1] === board[4] && board[4] === board[7]) endGame([1, 4, 7].map(i => buttons[i])); // 2nd culomn
    if (board[2] && board[2] === board[5] && board[5] === board[8]) endGame([2, 5, 8].map(i => buttons[i])); // 3rd culomn
    if (board[0] && board[0] === board[4] && board[4] === board[8]) endGame([0, 4, 8].map(i => buttons[i])); // Left diagonal 
    if (board[2] && board[2] === board[4] && board[4] === board[6]) endGame([2, 4, 6].map(i => buttons[i])); // Right diagonal
    if (board.every(cell => cell !== "")) endGame("draw"); // Draw if all cells filled but no line match
}

function endGame(victoryLine) {
    if (victoryLine === "draw") { // In case of Draw
        buttons.forEach(btn => btn.style.backgroundColor = "gold"); // All buttons will be clored with Gold
        statusText.innerText = "המשחק נגמר";
        currentPlayerDiv.textContent = "תיקו";
    } else { // In case of Victory
        victoryLine.forEach(btn => btn.style.backgroundColor = "SeaGreen"); // All buttons will be clored with Gold
        statusText.innerText = "המנצח הוא";
        currentPlayerDiv.textContent = victoryLine[0].innerText;
    }
    buttons.forEach(btn => btn.disabled = true); // Disable all buttons

}