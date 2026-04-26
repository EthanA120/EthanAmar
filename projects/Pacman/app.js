// ------------- Maze Setup -------------
// Mapping: 0: Empty, 1: Wall, 2: Pellet, 3: Power Pellet, 4: Pacman
let mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1],
    [0, 1, 2, 1, 2, 1, 0, 0, 0, 4, 0, 0, 0, 1, 2, 1, 2, 1, 0],
    [1, 1, 2, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 2, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const mazeContainer = document.getElementById('maze');

// Renders the maze based on the mazeLayout array

function createMaze() {
    // Clear current maze
    mazeContainer.innerHTML = '';

    mazeLayout.forEach((row, rowIndex) => {
        row.forEach((cellType, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // Adding coordinates as data attributes for easy access
            cell.dataset.x = colIndex;
            cell.dataset.y = rowIndex;

            switch (cellType) {
                case 1:
                    cell.classList.add('wall');
                    break;
                case 2:
                    const pellet = document.createElement('div');
                    pellet.classList.add('pellet');
                    cell.appendChild(pellet);
                    break;
                case 3:
                    const powerPellet = document.createElement('div');
                    powerPellet.classList.add('power-pellet');
                    cell.appendChild(powerPellet);
                    break;
                case 4:
                    const pacman = document.createElement('div');
                    pacman.classList.add('pacman');
                    cell.appendChild(pacman);
                    // Sync initial position
                    pacmanPos = { x: colIndex, y: rowIndex };
                    break;
            }
            mazeContainer.appendChild(cell);
        });
    });
}

// ------------- Pacman State -------------
// Track Pacman's position in the grid (row, col)
let pacmanPos = { x: 9, y: 7 };
const pacmanStartPos = { x: 9, y: 7 };
let currentDir = 'right';
let score = 0;
let hiScore = localStorage.getItem('pacman-hiScore') || 0;
let lives = 3;
let gameStarted = false;
let isPaused = false;
let pacmanInterval;
let ghostInterval;
let isScared = false;
let powerModeTimer = null;

// ------------- Ghost State & Logic -------------
let ghosts = [
    { x: 1, y: 1, returnX: 1, returnY: 1,startX: 8, startY: 9, lastX: 1, lastY: 1, isScared: false, className: 'ghost-red' },
    { x: 17, y: 1, returnX: 17, returnY: 1, startX: 9, startY: 9, lastX: 17, lastY: 1, isScared: false, className: 'ghost-cyan' },
    { x: 9, y: 13, returnX: 9, returnY: 13, startX: 10, startY: 9, lastX: 9, lastY: 13, isScared: false, className: 'ghost-orange' }
];

/**
 * Creates a ghost DOM element with eyes based on CSS definitions
 * @param {string} className - Color class for the ghost
 * @returns {HTMLElement} - The ghost element
 */
function createGhostElement(className) {
    const ghost = document.createElement('div');
    ghost.classList.add('ghost', className);

    // Create two eyes for the ghost as defined in CSS
    const eye1 = document.createElement('div');
    eye1.classList.add('ghost-eye');
    const eye2 = document.createElement('div');
    eye2.classList.add('ghost-eye');

    ghost.appendChild(eye1);
    ghost.appendChild(eye2);
    return ghost;
}

/**
 * Updates the visual position of all ghosts in the maze
 */
function updateGhostPositions() {
    document.querySelectorAll('.ghost').forEach(g => g.remove());

    ghosts.forEach(ghost => {
        const cell = document.querySelector(`[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
        if (cell) {
            // If ghosts are scared, use the scared class instead of their color class
            const displayClass = ghost.isScared ? 'ghost-scared' : ghost.className;
            cell.appendChild(createGhostElement(displayClass));
        }
    });
}

/**
 * Activates power pellet mode, making ghosts vulnerable
 */
function activatePowerMode() {
    ghosts.forEach(ghost => ghost.isScared = true);
    updateGhostPositions(); // Update visuals immediately

    // Reset existing timer if a second pellet is eaten
    if (powerModeTimer) clearTimeout(powerModeTimer);

    // Power mode lasts for 8 seconds
    powerModeTimer = setTimeout(() => {
        ghosts.forEach(ghost => ghost.isScared = false);
        updateGhostPositions();
    }, 8000);
}

/**
 * Moves ghosts randomly to adjacent non-wall cells
 */
function moveGhosts() {    
    ghosts.forEach(ghost => {
        const dirs = [{ x: 0, y: -1, w: 0 }, { x: 0, y: 1, w: 0 }, { x: -1, y: 0, w: 0 }, { x: 1, y: 0, w: 0 }];
        const moves = dirs
            .map(d => handleWraparound(ghost.x + d.x, ghost.y + d.y))
            .filter(pos => !isWall(pos.x, pos.y));

        // Use last location of ghosts to prevent repeatative movement
        const reapetChance = moves.length > 1 ? 8 : 1;
        moves.forEach(d => d.w = (d.x === ghost.lastX && d.y === ghost.lastY) ? 1 : reapetChance );
        const validMoves = moves.filter(d => Math.ceil(Math.random() * reapetChance) <= d.w); // 1/reapetChance chance to go back

        if (validMoves.length > 0) {
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            ghost.lastX = ghost.x; // Save the last location to prevent repeatative movement
            ghost.lastY = ghost.y;
            ghost.x = move.x;
            ghost.y = move.y;
        }
    });
    updateGhostPositions();
}

/**
 * Checks if Pacman has collided with any ghost
 */
function checkCollisions() {
    ghosts.forEach(ghost => {
        if (ghost.x === pacmanPos.x && ghost.y === pacmanPos.y) {
            if (ghost.isScared) {
                // Pacman eats the ghost
                score += 20;
                ghost.x = ghost.startX;
                ghost.y = ghost.startY;
                ghost.isScared = false; // This ghost is no longer scared after being eaten
                updateScoreDisplay();
                updateGhostPositions();
            } else {
                handleDeath();
            }
        }
    });
}

/**
 * Gets the rotation angle for a given direction
 * @param {string} direction - 'up', 'down', 'left', 'right'
 * @returns {number} - Rotation angle in degrees
 */
function getRotationAngle(direction) {
    switch (direction) {
        case 'up': return 270;
        case 'down': return 90;
        case 'left': return 180;
        case 'right': return 0;
        default: return 0;
    }
}

/**
 * Updates Pacman's visual rotation based on direction
 * @param {string} direction - 'up', 'down', 'left', 'right'
 */
function rotatePacman(direction) {
    const pacmanElement = document.querySelector('.pacman');
    if (!pacmanElement) return;

    const angle = getRotationAngle(direction);
    pacmanElement.style.transform = `rotate(${angle}deg)`;
}

/**
 * Checks if a position is a wall
 * @param {number} x - Column index
 * @param {number} y - Row index
 * @returns {boolean} - True if wall, false otherwise
 */
function isWall(x, y) {
    // Check bounds
    if (y < 0 || y >= mazeLayout.length || x < 0 || x >= mazeLayout[0].length) {
        return true; // Treat out of bounds as walls
    }
    return mazeLayout[y][x] === 1;
}

/**
 * Updates Pacman's position in the DOM based on pacmanPos
 */
function updatePacmanPosition() {
    const allCells = document.querySelectorAll('.cell');

    // Remove Pacman from all cells
    allCells.forEach(cell => {
        const pacman = cell.querySelector('.pacman');
        if (pacman) {
            pacman.remove();
        }
    });

    // Place Pacman in the correct cell
    const targetCell = document.querySelector(`[data-x="${pacmanPos.x}"][data-y="${pacmanPos.y}"]`);
    if (targetCell) {
        const pacmanElement = document.createElement('div');
        pacmanElement.classList.add('pacman');
        pacmanElement.style.transform = `rotate(${getRotationAngle(currentDir)}deg)`;
        targetCell.appendChild(pacmanElement);
    }
}

// ------------- Input Handling -------------
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (key === 'p' && gameStarted) {
        togglePause();
        return;
    }

    if (!['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) return;

    switch (e.key) {
        case 'ArrowUp':
            currentDir = 'up';
            rotatePacman('up');
            break;
        case 'ArrowDown':
            currentDir = 'down';
            rotatePacman('down');
            break;
        case 'ArrowLeft':
            currentDir = 'left';
            rotatePacman('left');
            break;
        case 'ArrowRight':
            currentDir = 'right';
            rotatePacman('right');
            break;
    }

    rotatePacman(currentDir);

    if (!gameStarted || isPaused) {
        startGame();
    }
});

/**
 * Updates the score display on the page
 */
function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score-val');
    const hiScoreElement = document.querySelector('.hi-score');
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    if (score > hiScore) {
        hiScore = score;
        localStorage.setItem('pacman-hiScore', hiScore);
    }
    
    if (hiScoreElement) {
        hiScoreElement.textContent = hiScore;
    }
}

/**
 * Saves the current state of the maze and score to localStorage
 */
function saveProgress() {
    localStorage.setItem('pacman-score', score);
    localStorage.setItem('pacman-maze', JSON.stringify(mazeLayout));
}

/**
 * Loads saved progress from localStorage
 */
function loadProgress() {
    const savedMaze = localStorage.getItem('pacman-maze');
    const savedScore = localStorage.getItem('pacman-score');

    if (savedMaze) {
        mazeLayout = JSON.parse(savedMaze);
    }
    if (savedScore) {
        score = parseInt(savedScore);
    }
    updateScoreDisplay();
}

function handleDeath() {
    lives--;
    const hearts = document.querySelectorAll('.lives .material-symbols-outlined');
    if (hearts[lives]) hearts[lives].classList.add('empty-heart');

    if (lives <= 0) {
        alert("GAME OVER!");
        localStorage.removeItem('pacman-maze');
        localStorage.removeItem('pacman-score');
        location.reload();
    } else {
        // Reset positions but keep maze state
        pacmanPos = { ...pacmanStartPos };
        ghosts.forEach(ghost => {
            ghost.x = ghost.returnX;
            ghost.y = ghost.returnY;
            ghost.isScared = false;
        });
        currentDir = 'right';
        updatePacmanPosition();
        updateGhostPositions();
        pauseGame();
    }
}

/**
 * Collects a pellet at the given position if one exists
 * @param {number} x - Column index
 * @param {number} y - Row index
 */
function collectPellet(x, y) {
    const cellValue = mazeLayout[y][x];

    // Check if there's a pellet or power pellet at this position
    if (cellValue === 2) {
        // Regular pellet: 1 point
        score += 1;
        mazeLayout[y][x] = 0; // Remove pellet from maze data
        saveProgress();
    } else if (cellValue === 3) {
        // Power pellet: 5 points
        score += 5;
        mazeLayout[y][x] = 0; // Remove pellet from maze data
        activatePowerMode();
        saveProgress();
    }

    // Remove the pellet element from the DOM
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        const pellet = cell.querySelector('.pellet');
        const powerPellet = cell.querySelector('.power-pellet');
        if (pellet) pellet.remove();
        if (powerPellet) powerPellet.remove();
    }

    // Update the score display
    updateScoreDisplay();
}

/**
 * Checks if there are any pellets or power pellets left in the maze
 * @returns {boolean} - True if maze is empty of pellets
 */
function isMazeEmpty() {
    return !mazeLayout.some(row => row.some(cell => cell === 2 || cell === 3));
}

/**
 * Spawns two bonus power pellets at random empty locations
 */
function spawnBonusPowerPellets() {
    const emptyCells = [];
    
    // Find all empty cells (excluding where Pacman currently is)
    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 0 && !(pacmanPos.x === x && pacmanPos.y === y)) {
                emptyCells.push({ x, y });
            }
        });
    });

    // If we have enough space, pick 2 random locations
    if (emptyCells.length >= 2) {
        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const pos = emptyCells.splice(randomIndex, 1)[0];

            mazeLayout[pos.y][pos.x] = 3; // 3 is Power Pellet

            // Update the DOM to show the new pellet
            const cell = document.querySelector(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
            if (cell) {
                const powerPellet = document.createElement('div');
                powerPellet.classList.add('power-pellet');
                cell.appendChild(powerPellet);
            }
        }
        saveProgress();
    }
}

/**
 * Handles wraparound when Pacman moves off the edge of the maze
 * @param {number} x - Column index
 * @param {number} y - Row index
 * @returns {object} - Wrapped coordinates {x, y}
 */
function handleWraparound(x, y) {
    const cols = mazeLayout[0].length;

    // Wrap horizontally
    if (x < 0) {
        x = cols - 1; // Go to rightmost column
    } else if (x >= cols) {
        x = 0; // Go to leftmost column
    }

    return { x, y };
}

/**
 * Moves Pacman in the current direction if not blocked by a wall
 */
function movePacman() {
    let newX = pacmanPos.x;
    let newY = pacmanPos.y;

    // Calculate new position based on current direction
    switch (currentDir) {
        case 'up':
            newY = pacmanPos.y - 1;
            break;
        case 'down':
            newY = pacmanPos.y + 1;
            break;
        case 'left':
            newX = pacmanPos.x - 1;
            break;
        case 'right':
            newX = pacmanPos.x + 1;
            break;
    }

    // Handle wraparound at maze edges
    const wrapped = handleWraparound(newX, newY);
    newX = wrapped.x;
    newY = wrapped.y;

    // Check for collision with walls
    // if it wrapped it's already changed to available coordinates
    if (!isWall(newX, newY)) {
        pacmanPos.x = newX;
        pacmanPos.y = newY;
        updatePacmanPosition();

        // Collect pellet if one exists at this position
        collectPellet(newX, newY);

        // Check if level is cleared to spawn bonus pellets
        if (isMazeEmpty()) {
            spawnBonusPowerPellets();
        }
        checkCollisions();
    } else {
        console.log(`Wall detected at: (${newX}, ${newY})`);
    }
}

// ------------- Game Loop -------------
function startGame() {
    if (gameStarted && !isPaused) return;
    
    isPaused = false;
    gameStarted = true;

    // Hide instruction overlay and remove dimmed effect
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const maze = document.getElementById('maze');
    if (maze) maze.classList.remove('dimmed');

    // Clear any existing intervals to avoid speed-up
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);

    // Start loops
    pacmanInterval = setInterval(movePacman, 100);
    ghostInterval = setInterval(() => {
        moveGhosts();
        checkCollisions();
    }, 250);

    console.log("Game Started/Resumed!");
}

function pauseGame() {
    if (!gameStarted || isPaused) return;
    
    isPaused = true;
    clearInterval(pacmanInterval);
    clearInterval(ghostInterval);

    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'flex';

    const maze = document.getElementById('maze');
    if (maze) maze.classList.add('dimmed');
}

function togglePause() {
    if (isPaused) startGame();
    else pauseGame();
}


// Initialize
document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game? all your progress will be lost!')) {
        localStorage.removeItem('pacman-maze');
        localStorage.removeItem('pacman-score');
        location.reload();
    }
});

loadProgress();
createMaze();
updateGhostPositions(); // Show ghosts (frozen) before the game starts
