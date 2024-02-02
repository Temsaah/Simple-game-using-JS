const grid = document.getElementsByClassName("grid")[0];
const score = document.querySelector(".score");
const scoreNumber = document.querySelector("span");
const startBtn = document.querySelector(".start");
const easyBtn = document.querySelector(".easy");
const hardBtn = document.querySelector(".hard");
let sc = 0;

const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;

let xDirection = 2;
let yDirection = 2;
let timerId;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [230, 40];
let currentBallPos = ballStart;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// Starting the Game
startBtn.onclick = function () {
  let diffContainer = document.createElement("div");
  diffContainer.classList.add("difficulties");
  const easyBtn = document.createElement("button");
  easyBtn.classList.add("easy");
  easyBtn.innerHTML = "Easy";
  const hardBtn = document.createElement("button");
  hardBtn.classList.add("hard");
  hardBtn.innerHTML = "Hard";
  diffContainer.appendChild(easyBtn);
  diffContainer.appendChild(hardBtn);
  document.body.appendChild(diffContainer);
  startBtn.remove();

  // Easy button
  easyBtn.onclick = function () {
    timerId = setInterval(moveBall, 20);
    diffContainer.remove();
  };
  // Hard button
  hardBtn.onclick = function () {
    timerId = setInterval(moveBall, 10);
    diffContainer.remove();
  };
};

// Function to Draw blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    grid.appendChild(block);
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
  }
}

addBlocks();

// Add user
const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();
document.body.addEventListener("keydown", moveUser);

// Draw user Function
function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}
// Moving the user

function moveUser(ev) {
  switch (ev.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

// Add Ball
const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

// Draw Ball Function
function drawBall() {
  ball.style.left = currentBallPos[0] + "px";
  ball.style.bottom = currentBallPos[1] + "px";
}

// Move Ball
function moveBall() {
  currentBallPos[0] += xDirection;
  currentBallPos[1] += yDirection;
  drawBall();
  checkForCollisions();
  checkIfGameCompleted();
}

function checkIfGameCompleted() {
  if (blocks.length == 0) {
    score.classList.add("won");
    score.innerHTML = "YOU WON";
    document.body.removeEventListener("keydown", moveUser);
    clearInterval(timerId);
    createTryAgainBtn();
  }
}

// Check for collisions
function checkForCollisions() {
  // Check for User Collisions
  if (
    currentBallPos[0] > currentPosition[0] &&
    currentBallPos[0] < currentPosition[0] + blockWidth &&
    currentBallPos[1] > currentPosition[1] &&
    currentBallPos[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // Check if you have collided with a block
  for (let i = 0; i < blocks.length; i++) {
    if (
      currentBallPos[0] > blocks[i].bottomLeft[0] &&
      currentBallPos[0] < blocks[i].bottomRight[0] &&
      currentBallPos[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      currentBallPos[1] + ballDiameter < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      sc++;
      scoreNumber.innerHTML = sc;
    }
  }

  // Check if you collided with wall
  if (
    currentBallPos[0] >= boardWidth - ballDiameter - 2 ||
    currentBallPos[1] > boardHeight - ballDiameter - 2 ||
    currentBallPos[0] <= 0 ||
    currentBallPos[1] <= 0
  ) {
    changeDirection();
  }
  // Check if you lost
  if (currentBallPos[1] <= 0) {
    clearInterval(timerId);
    score.classList.add("lost");
    score.innerHTML = "YOU LOST";
    document.body.removeEventListener("keydown", moveUser);
    createTryAgainBtn();
    createBestScore();
  }
}

// Create Best Score
function createBestScore() {
  let bestScore = document.createElement("span");
  bestScore.classList.add("best-score");
  bestScore.innerHTML = `Best Score: ${sc}`;
  document.body.appendChild(bestScore);
}

// Create Try again button with its functions
function createTryAgainBtn() {
  let tryBtn = document.createElement("button");
  tryBtn.classList.add("try-Btn");
  tryBtn.innerHTML = "Try Again";
  document.body.appendChild(tryBtn);
  tryBtn.onclick = function () {
    location.reload();
  };
}

// Change Direction Function
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;

    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
