document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('sudoku-grid');
    const timerElement = document.getElementById('timer');
    const numberBtns = document.querySelectorAll('.num-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const newGameBtn = document.getElementById('new-game');

    let selectedCell = null;
    let seconds = 0;
    let timerInterval = null;
    let currentDifficulty = 'easy';

    // Fetch board from API based on difficulty
    async function fetchBoard(difficulty) {
        gridElement.innerHTML = '<p style="grid-column: span 9; color: white;">Loading board...</p>';
        try {
            const response = await fetch(`https://sudoku-api.vercel.app/api/dosuku?difficulty=${difficulty}`);
            const data = await response.json();
            const boardData = data.newboard.grids[0].value;
            renderGrid(boardData);
        } catch (error) {
            console.error('Error fetching board:', error);
            alert('Failed to load board. Please try again.');
        }
    }

    // Display the difficulty selection menu
    function showDifficultyMenu() {
        // Check if overlay already exists to avoid duplicates
        if (document.querySelector('.overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="menu">
                <h2>Select Difficulty</h2>
                <button class="action-btn" data-level="easy">Easy</button>
                <button class="action-btn" data-level="medium">Medium</button>
                <button class="action-btn" data-level="hard">Hard</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentDifficulty = btn.dataset.level;
                const difficultyDisplay = document.getElementById('difficulty');
                if (difficultyDisplay) {
                    difficultyDisplay.textContent = `Level: ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
                }
                overlay.remove();
                initNewGame();
            });
        });
    }

    // Render the Sudoku grid based on a 2D array
    function renderGrid(board) {
        gridElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const val = board[r][c];

                if (val !== 0) {
                    cell.textContent = val;
                    cell.classList.add('fixed');
                }

                cell.dataset.row = r;
                cell.dataset.col = c;

                cell.addEventListener('click', () => {
                    selectedCell = cell;
                    updateVisuals();
                });

                gridElement.appendChild(cell);
            }
        }
    }

    // Updates highlights and errors visually
    function updateVisuals() {
        const allCells = gridElement.querySelectorAll('.cell');
        allCells.forEach(c => c.classList.remove('selected', 'peer', 'error-peer', 'error'));

        if (!selectedCell) return;
        
        selectedCell.classList.add('selected');
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;

        allCells.forEach(c => {
            const r = parseInt(c.dataset.row);
            const cc = parseInt(c.dataset.col);
            const inBox = r >= boxRowStart && r < boxRowStart + 3 && cc >= boxColStart && cc < boxColStart + 3;

            if (r === row || cc === col || inBox) {
                if (c !== selectedCell) c.classList.add('peer');
            }
        });

        // Run validation for all cells to catch all conflicts
        validateAll();
    }

    function initNewGame() {
        stopTimer();
        seconds = 0;
        timerElement.textContent = '00:00';
        fetchBoard(currentDifficulty);
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.textContent = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function checkWin() {
        const cells = Array.from(gridElement.querySelectorAll('.cell'));
        const allFilled = cells.every(cell => cell.textContent !== '');
        const hasErrors = cells.some(cell => cell.classList.contains('error'));

        if (allFilled && !hasErrors) {
            showWinScreen();
        }
    }

    function showWinScreen() {
        stopTimer();
        const finalTime = timerElement.textContent;
        
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="menu win-card">
                <h2>🏆 Victory!</h2>
                <p>You completed the puzzle in <strong>${finalTime}</strong></p>
                <button class="action-btn" id="play-again">Play Again</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('play-again').addEventListener('click', () => {
            overlay.remove();
            showDifficultyMenu();
        });
    }

    // Handle number input
    numberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedCell && !selectedCell.classList.contains('fixed')) {
                startTimer();
                selectedCell.textContent = btn.textContent;
                updateVisuals();
                checkWin();
            }
        });
    });

    deleteBtn.addEventListener('click', () => {
        if (selectedCell && !selectedCell.classList.contains('fixed')) {
            selectedCell.textContent = '';
            updateVisuals();
        }
    });

    // Keyboard support for input and navigation
    document.addEventListener('keydown', (e) => {
        if (!selectedCell) return;

        // Input numbers 1-9
        if (e.key >= '1' && e.key <= '9' && !selectedCell.classList.contains('fixed')) {
            startTimer();
            selectedCell.textContent = e.key;
            updateVisuals();
            checkWin();
        } 
        // Handle deletion
        else if ((e.key === 'Backspace' || e.key === 'Delete') && !selectedCell.classList.contains('fixed')) {
            selectedCell.textContent = '';
            updateVisuals();
        } 
        // Handle navigation with arrows
        else if (e.key.startsWith('Arrow')) {
            const r = parseInt(selectedCell.dataset.row);
            const c = parseInt(selectedCell.dataset.col);
            let nr = r, nc = c;
            if (e.key === 'ArrowUp') nr = Math.max(0, r - 1);
            if (e.key === 'ArrowDown') nr = Math.min(8, r + 1);
            if (e.key === 'ArrowLeft') nc = Math.max(0, c - 1);
            if (e.key === 'ArrowRight') nc = Math.min(8, c + 1);
            selectedCell = gridElement.querySelectorAll('.cell')[nr * 9 + nc];
            updateVisuals();
        }
    });

    // Global validation logic to check all conflicts and highlight areas
    function validateAll() {
        const allCells = Array.from(gridElement.querySelectorAll('.cell'));
        allCells.forEach(c => c.classList.remove('error', 'error-peer'));

        allCells.forEach(cell => {
            const val = cell.textContent;
            if (!val) return;

            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            const boxR = Math.floor(r / 3) * 3;
            const boxC = Math.floor(c / 3) * 3;
            
            let conflictInRow = false;
            let conflictInCol = false;
            let conflictInBox = false;

            for (let i = 0; i < 9; i++) {
                const rowCell = allCells[r * 9 + i];
                if (rowCell !== cell && rowCell.textContent === val) conflictInRow = true;

                const colCell = allCells[i * 9 + c];
                if (colCell !== cell && colCell.textContent === val) conflictInCol = true;
            }

            for (let i = boxR; i < boxR + 3; i++) {
                for (let j = boxC; j < boxC + 3; j++) {
                    const boxCell = allCells[i * 9 + j];
                    if (boxCell !== cell && boxCell.textContent === val) conflictInBox = true;
                }
            }

            if (conflictInRow || conflictInCol || conflictInBox) {
                cell.classList.add('error');
                if (conflictInRow) {
                    for (let i = 0; i < 9; i++) allCells[r * 9 + i].classList.add('error-peer');
                }
                if (conflictInCol) {
                    for (let i = 0; i < 9; i++) allCells[i * 9 + c].classList.add('error-peer');
                }
                if (conflictInBox) {
                    for (let i = boxR; i < boxR + 3; i++) {
                        for (let j = boxC; j < boxC + 3; j++) {
                            allCells[i * 9 + j].classList.add('error-peer');
                        }
                    }
                }
            }
        });
    }

    if (newGameBtn) {
        newGameBtn.addEventListener('click', showDifficultyMenu);
    }

    showDifficultyMenu();
});
