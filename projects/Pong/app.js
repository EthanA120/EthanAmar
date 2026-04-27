/**
 * Modern Pong - Core Game Logic
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const uiOverlay = document.getElementById('ui-overlay');
const pauseOverlay = document.getElementById('pause-overlay');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Game Dimensions
canvas.width = 800;
canvas.height = 500;

// Game State
let gameState = 'START'; // 'START' or 'PLAYING'
let isPaused = false;
let difficulty = 'easy';
let playerScore = 0;
let aiScore = 0;

// Configuration based on difficulty
const config = {
    easy: {
        ballSpeed: 3,
        aiSpeed: 3.5,
        aiReactionDelay: 0.1
    },
    hard: {
        ballSpeed: 7,
        aiSpeed: 6.5,
        aiReactionDelay: 0.05
    }
};

// Object Definitions
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

const player = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#00f2ff'
};

const ai = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#ff007b'
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize,
    speed: 0,
    velocityX: 0,
    velocityY: 0,
    color: '#ffffff'
};

// Event Listeners
window.addEventListener('mousemove', (e) => {
    if (gameState === 'PLAYING') {
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        
        // Center paddle to mouse
        player.y = mouseY - player.height / 2;

        // Keep inside canvas
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    }
});

uiOverlay.addEventListener('click', () => {
    if (gameState === 'START') {
        startGame();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'פ' && gameState === 'PLAYING') {
        togglePause();
    }
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent starting game when just clicking buttons
        difficulty = btn.dataset.difficulty;
        
        // UI Update
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Game Logic Functions
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Set speed based on difficulty
    const initialSpeed = config[difficulty].ballSpeed;
    
    // Random direction
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * initialSpeed;
    ball.velocityY = (Math.random() * 2 - 1) * initialSpeed;
    ball.speed = initialSpeed;
}

function startGame() {
    gameState = 'PLAYING';
    isPaused = false;
    uiOverlay.classList.add('hidden');
    canvas.style.cursor = 'none';
    resetBall();
}

function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    canvas.style.cursor = isPaused ? 'default' : 'none';
}

// b for ball, p for paddle, checks the location of paddle and returns true if it's equal
function collision(b, p) {
    // location of the paddle with respect to it's volume
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    // location of the ball with respect to it's volume
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function update() {
    if (gameState !== 'PLAYING' || isPaused) return;

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI Movement (follows ball)
    const aiTargetY = ball.y - ai.height / 2;
    const aiLerp = config[difficulty].aiReactionDelay;
    ai.y += (aiTargetY - ai.y) * (difficulty === 'hard' ? 0.12 : 0.08);

    // Keep AI in bounds
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    // Wall collision (Top/Bottom)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision
    let selectedPaddle = (ball.x < canvas.width / 2) ? ai : player;

    if (collision(ball, selectedPaddle)) {
        // Find where the ball hit the paddle
        let collidePoint = (ball.y - (selectedPaddle.y + selectedPaddle.height / 2));
        collidePoint = collidePoint / (selectedPaddle.height / 2);

        // Calculate angle in Radians (45 degrees max)
        let angleRad = (Math.PI / 4) * collidePoint;

        // Direction of the ball when hit
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Speed up the ball slightly on every hit
        ball.speed += 0.2;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        resetBall();
    }
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function render() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isPaused) {
        ctx.globalAlpha = 0.5; // Dim the game while paused
    }

    // Draw Player Paddle (with subtle glow)
    ctx.shadowBlur = 10;
    ctx.shadowColor = player.color;
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // Draw AI Paddle (with subtle glow)
    ctx.shadowColor = ai.color;
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw Ball (reset shadow for ball)
    ctx.shadowBlur = 0;
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    ctx.globalAlpha = 1.0; // Reset alpha
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the loop (but updates won't happen until gameState is 'PLAYING')
gameLoop();