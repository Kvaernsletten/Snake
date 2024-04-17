
let app = document.getElementById('app');
let score = 0;
let highscore = 0;
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const highscoreText = document.querySelector("#highscoreText");
const resetButton = document.querySelector("#resetButton");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "rgba(106, 81, 117, 0.719)";
const snakeColor = "yellow";
const snakeBorder = "black";
const foodColor = "red";
const foodBorder = "black";
const unitSize = 25;
let goingLeft = false;
let goingUp = false;
let goingRight = true;
let goingDown = false;
let gameRuntime = false;
let gameSpeed = 75;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let snake = [
     {x: unitSize * 4, y: 0},
     {x: unitSize * 3, y: 0},
     {x: unitSize * 2, y: 0},
     {x: unitSize, y: 0},
     {x: 0, y: 0},
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);


gameStart();

function gameStart(){

    gameRuntime = true;
    scoreText.innerHTML = "Score: " + score;
    highscoreText.innerHTML = "Highscore: " + highscore;
    createFood();
    drawFood();
    nextTick();

}

function nextTick(){

    if(gameRuntime){
        frames = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, gameSpeed);
    }
    else{
        displayGameOver();
    }

}

function clearBoard(){

    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

}

function createFood() {
    function randomFood(min, max) {
        const randomNumber = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randomNumber;
    }

    let foodOverlap = true;
    while (foodOverlap) {
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);
        foodOverlap = false;

        for (let i = 0; i < snake.length; i++) {
            if (foodX === snake[i].x && foodY === snake[i].y) {
                foodOverlap = true;
                break;
            }
        }
    }
}

function drawFood(){

    ctx.fillStyle = foodColor;
    ctx.strokeStyle = foodBorder;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.strokeRect(foodX, foodY, unitSize, unitSize);

}


function drawSnake(){

    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })

}

let directionQueue = []; 

function changeDirection(event) {
    const keyPressed = event.keyCode;

    const LEFT = [37, 65];
    const UP = [38, 87];
    const RIGHT = [39, 68];
    const DOWN = [40, 83];

    switch (true) {
        case (LEFT.includes(keyPressed) && gameRuntime):
            directionQueue.push([-unitSize, 0]);
            break;
        case (UP.includes(keyPressed) && gameRuntime):
            directionQueue.push([0, -unitSize]);
            break;
        case (RIGHT.includes(keyPressed) && gameRuntime):
            directionQueue.push([unitSize, 0]);
            break;
        case (DOWN.includes(keyPressed) && gameRuntime):
            directionQueue.push([0, unitSize]);
            break;
    }
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (directionQueue.length > 0) {
        const [nextXVelocity, nextYVelocity] = directionQueue.shift();
        if ((xVelocity !== -nextXVelocity || yVelocity !== -nextYVelocity) && (xVelocity !== nextXVelocity || yVelocity !== nextYVelocity)) {
            xVelocity = nextXVelocity;
            yVelocity = nextYVelocity;
        }
    }

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        if(score > highscore){
            highscore++;
        }
        if(gameSpeed > 40){
            gameSpeed--;
        }
        scoreText.innerHTML = "Score: " + score;
        highscoreText.innerHTML = "Highscore: " + highscore;
        createFood();
    } else {
        snake.pop();
    }
}


function checkGameOver(){

    switch(true){
        case (snake[0].x < 0):
            gameRuntime = false;
            break;
        case (snake[0].x >= gameWidth):
            gameRuntime = false;
            break;
        case (snake[0].y < 0):
            gameRuntime = false;
            break;
        case (snake[0].y >= gameHeight):
            gameRuntime = false;
            break;
        }

    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            gameRuntime = false;
        }
    }
}

function displayGameOver(){

    ctx.font = "50px none";
    ctx.fillStyle = "rgb(211, 134, 45)";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    
    
    gameRuntime = false;

}

function resetGame(){

    clearInterval(frames);
    gameSpeed = 75;
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0},
   ];

   gameStart();
}
