const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = generateFood();
let gameOver = false;
let isPaused = true; // Jogo começa pausado
let gameInterval = null;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let gameSpeed = 100;

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawSnake() {
    snake.forEach(segment => drawTile(segment.x, segment.y, 'lime'));
}

function drawFood() {
    drawTile(food.x, food.y, 'red');
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function updateSnake() {
    if (gameOver || isPaused) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        alert('Game Over!');
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        clearInterval(gameInterval);
        gameInterval = null;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
        document.getElementById('score').textContent = `Pontuação: ${score}`;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').textContent = `Recorde: ${highScore}`;
        }

        if (score % 5 === 0) {
            adjustSpeed();
        }
    } else {
        snake.pop();
    }
}

function adjustSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    updateSnake();
}

window.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
    if (key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
    if (key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };

    if (key === ' ') {
        togglePause();
    }
});

function startNewGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    food = generateFood();
    gameOver = false;
    score = 0;
    gameSpeed = 100;
    isPaused = false;
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('playPauseButton').textContent = 'Pause';
}

function togglePause() {
    if (gameOver) return;

    if (isPaused) {
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    isPaused = !isPaused;
}

document.getElementById('playPauseButton').addEventListener('click', () => {
    if (gameOver) {
        startNewGame();
    } else if (gameInterval === null) {
        gameInterval = setInterval(gameLoop, gameSpeed);
        isPaused = false;
        document.getElementById('playPauseButton').textContent = 'Pause';
    } else {
        togglePause();
        document.getElementById('playPauseButton').textContent = isPaused ? 'Play' : 'Pause';
    }
});

document.getElementById('newGameButton').addEventListener('click', () => {
    startNewGame();
});

document.getElementById('highScore').textContent = `Recorde: ${highScore}`;

// Inicializar o áudio da música de fundo
const backgroundMusic = new Audio('background.mp3.mp3');
backgroundMusic.loop = true; // Reproduzir em loop

function playMusic() {
    if (!backgroundMusic.paused) return;
    backgroundMusic.play();
}

function pauseMusic() {
    backgroundMusic.pause();
}

function startNewGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    food = generateFood();
    gameOver = false;
    score = 0;
    gameSpeed = 100;
    isPaused = false;
    document.getElementById('score').textContent = `Pontuação: ${score}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('playPauseButton').textContent = 'Pause';

    playMusic(); // Tocar música ao iniciar o jogo
}

function togglePause() {
    if (gameOver) return;

    if (isPaused) {
        gameInterval = setInterval(gameLoop, gameSpeed);
        playMusic(); // Continuar música
    } else {
        clearInterval(gameInterval);
        gameInterval = null;
        pauseMusic(); // Pausar música
    }
    isPaused = !isPaused;
}

// Pausar música quando o jogo terminar
function updateSnake() {
    if (gameOver || isPaused) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        pauseMusic(); // Parar música ao terminar o jogo
        alert('Game Over!');
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        clearInterval(gameInterval);
        gameInterval = null;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
        document.getElementById('score').textContent = `Pontuação: ${score}`;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').textContent = `Recorde: ${highScore}`;
        }

        if (score % 5 === 0) {
            adjustSpeed();
        }
    } else {
        snake.pop();
    }
}
