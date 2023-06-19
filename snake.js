const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const blockSize = 10;
let snake = [
    {x: 3, y: 1},
    {x: 2, y: 1},
    {x: 1, y: 1}
];
let direction = "right";
let score = 0;
let food = {
    x: Math.floor(Math.random() * canvas.width / blockSize),
    y: Math.floor(Math.random() * canvas.height / blockSize)
};

function drawBlock(x, y) {
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        drawBlock(segment.x, segment.y);
    });
}

function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};
    switch(direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvas.width / blockSize),
            y: Math.floor(Math.random() * canvas.height / blockSize)
        };
    } else {
        snake.pop();
    }
}

function handleKeyPress(event) {
    switch(event.key) {
        case "ArrowUp":
            if (direction !== "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
            if (direction !== "up") {
                direction = "down";
            }
            break;
        case "ArrowLeft":
            if (direction !== "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
            if (direction !== "left") {
                direction = "right";
            }
            break;
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    drawBlock(food.x, food.y);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    moveSnake();
    drawFood();
 drawScore();

    if (checkCollision()) {
        clearInterval(gameInterval);
        alert(`Game over! Your score was ${score}`);
    }
}

function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / blockSize ||
        head.y < 0 || head.y >= canvas.height / blockSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener("keydown", handleKeyPress);
let gameInterval = setInterval(gameLoop, 100);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let touchStartX, touchStartY;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "left") {
            direction = "right";
        } else if (dx < 0 && direction !== "right") {
            direction = "left";
        }
    } else {
        if (dy > 0 && direction !== "up") {
            direction = "down";
        } else if (dy < 0 && direction !== "down") {
            direction = "up";
        }
    }


    touchStartX = null;
    touchStartY = null;
}
