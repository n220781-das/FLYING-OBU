const game = document.getElementById("game");
const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

// AUDIO SETTINGS

const backgroundMusic = new Audio("assets/background.mp3");
const jumpSound = new Audio("assets/jump.mp3");
const gameOverSound = new Audio("assets/gameover.mp3");
const startVoice = new Audio("assets/start-voice.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.05;

jumpSound.volume = 1.0;
gameOverSound.volume = 1.0;
startVoice.volume = 1.0;

let playerY = 220;
let velocity = 0;
let obstacleX = -65;
let gapTop = 150;
let score = 0;
let playing = false;
let animationId;

const gravity = 0.35;
const jumpPower = -6.5;
const speed = 2.5;
const obstacleWidth = obstacle.offsetWidth;

function setGap() {
  const gameHeight = game.clientHeight;

  const maxGapTop = Math.max(70, gameHeight - 280);
gapTop = 70 + Math.random() * (maxGapTop - 70);

  obstacle.style.setProperty("--gap-top", gapTop + "px");

  obstacle.style.setProperty(
    "--gap-bottom",
    (gameHeight - gapTop - 210) + "px"
  );
}

function resetGame() {
  playerY = game.clientHeight / 2 - player.offsetHeight / 2;
  velocity = 0;
  obstacleX = -obstacleWidth;
  score = 0;

  player.style.top = playerY + "px";

  obstacle.style.right = -obstacleWidth + "px";
  obstacle.passed = false;

  scoreText.textContent = "Score: 0";

  setGap();
}

function startGame() {
  cancelAnimationFrame(animationId);
  resetGame();

  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch(() => {});

  startVoice.currentTime = 0;
  startVoice.play().catch(() => {});

  playing = true;
  message.style.display = "none";

  gameLoop();
}

function fly(){
  if (playing){
    velocity=jumpPower;
    jumpSound.currentTime=0;
    jumpSound.play().catch(()=>{});
  }
}

function gameOver() {
  playing = false;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  gameOverSound.currentTime = 0;
  gameOverSound.play().catch(() => {});

  message.innerHTML = `
    <h2>GAME OVER!</h2>
    <p>Your Score: ${score}</p>
    <button id="restartBtn">PLAY AGAIN</button>
  `;

  message.style.display = "flex";

  document.getElementById("restartBtn")
    .addEventListener("click", startGame);
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  const touchingObstacle =
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right;

  if (touchingObstacle) {
    const safeTop = obstacleRect.top + gapTop;
    const safeBottom = safeTop + 210;

    if (
      playerRect.top < safeTop ||
      playerRect.bottom > safeBottom
    ) {
      return true;
    }
  }

  return (
    playerY < 0 ||
    playerY + player.offsetHeight > game.clientHeight
  );
}

function gameLoop() {
  if (!playing) return;

  velocity += gravity;
  playerY += velocity;

  player.style.top = playerY + "px";

  obstacleX += speed;
  obstacle.style.right = obstacleX + "px";

  const obstacleLeft =
    game.clientWidth - obstacleX - obstacle.offsetWidth;

  if (obstacleLeft < 65 && !obstacle.passed) {
    obstacle.passed = true;
    score++;
    scoreText.textContent = "Score: " + score;
  }

  if (obstacleX > game.clientWidth + obstacleWidth) {
  obstacleX = -obstacleWidth;
  obstacle.style.right = obstacleX + "px";
  obstacle.passed = false;
  setGap();
}

  if (checkCollision()) {
    gameOver();
    return;
  }

  animationId = requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);

game.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  fly();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    fly();
  }
});


