// Set up the canvas and context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Set up the game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: getRandomNumber(0, canvas.width / 10 - 1) * 10, y: getRandomNumber(0, canvas.height / 10 - 1) * 10 };
let direction = "right";
let score = 0;

// Set up the game loop
const gameLoop = setInterval(function() {
    // Move the snake
    let newHead = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case "right":
            newHead.x += 10;
            break;
        case "left":
            newHead.x -= 10;
            break;
        case "up":
            newHead.y -= 10;
            break;
        case "down":
            newHead.y += 10;
            break;
    }
    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food.x = getRandomNumber(0, canvas.width / 10 - 1) * 10;
        food.y = getRandomNumber(0, canvas.height / 10 - 1) * 10;
    } else {
        snake.pop();
    }

    // Draw the game board
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, 10, 10);
    context.fillStyle = "green";
    snake.forEach(function(segment) {
        context.fillRect(segment.x, segment.y, 10, 10);
    });

    // Check for game over
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver();
        }
    }

    // Update the score
    document.getElementById("score").textContent = score;
}, 100);

// Set up the keyboard controls
document.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 37:
            if (direction !== "right") {
                direction = "left";
            }
            break;
        case 38:
            if (direction !== "down") {
                direction = "up";
            }
            break;
        case 39:
            if (direction !== "left") {
                direction = "right";
            }
            break;
        case 40:
            if (direction !== "up") {
                direction = "down";
            }
            break;
    }
});

// Helper function to get a random number within a range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to end the game and show the score
function gameOver() {
    clearInterval(gameLoop)
    location.reload();
    alert("Game over! Your score was " + score + ".");
}

// Set up the "New Game" button
const newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", function() {
    location.reload();
});
