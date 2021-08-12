const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let lastKeyPress;
const size = 20;
const gridSize = canvas.width / size;
let state;
let running = false;

function init() {
  state = createState();
  console.log("new Game");
  running = true;
  startGameloop();
}

function startGameloop() {
  const intervalId = setInterval(() => {
    const winner = gameLoop();
    draw();
    if (!winner) die(intervalId);
  }, 300);
}

function die(intervalId) {
  console.log("died");
  clearInterval(intervalId);
  running = false;
  init();
}

document.addEventListener("keydown", (event) => {
  if (![40, 38, 37, 39].includes(event.keyCode)) return;
  event.preventDefault();
  //checking for opposite key
  handleKeyCode(event.keyCode);
});

function handleKeyCode(key) {
  if (!running) return;
  if (!(lastKeyPress + 2 != key && lastKeyPress - 2 != key)) return;
  lastKeyPress = key;

  console.log(key);

  let vel = state.player.vel;
  switch (key) {
    //left
    case 37:
      (vel.x = -1), (vel.y = 0);
      break;
    //up
    case 38:
      (vel.x = 0), (vel.y = -1);
      break;
    //rigth
    case 39:
      (vel.x = 1), (vel.y = 0);
      break;
    //down
    case 40:
      (vel.x = 0), (vel.y = 1);
      break;
  }
}

function draw() {
  requestAnimationFrame(() => {
    ctx.fillStyle = "#202124";
    ctx.fillRect(0, 0, canvas.height, canvas.width);

    drawFood(state.food);
    drawSnake(state.player);
  });
}

function drawSnake(player) {
  ctx.fillStyle = "green";

  player.body.forEach((cell) => {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  });
}

function drawFood(cell) {
  ctx.fillStyle = "red";
  ctx.fillRect(cell.x * size, cell.y * size, size, size);
}

function gameLoop() {
  if (!state) return;

  player = state.player;

  //update head
  player.head.x += player.vel.x;
  player.head.y += player.vel.y;

  //checking for collision with walls
  if (player.head.x < 0 || player.head.y < 0) return false;
  if (player.head.x >= gridSize || player.head.y >= gridSize) return false;

  //check for food
  if (isEqual(player.head, state.food)) {
    //make a new cell
    player.body.push({ ...player.head });

    //increment pos of that head
    player.head.x += player.vel.x;
    player.head.y += player.vel.y;

    //random food
    state.food = generateFood(player.body);
  }

  //check deadth
  for (let i = 0; i < player.body.length; i++) {
    if (isEqual(player.head, player.body[i])) return false;
  }

  //moving the snake forward
  player.body.push({ ...player.head });
  player.body.shift();

  return true;
}

function createState() {
  return {
    player: {
      vel: { x: 1, y: 0 },
      head: { x: 5, y: 5 },
      body: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
      ],
    },
    food: { x: 10, y: 10 },
  };
}

function generateFood(snake) {
  let food = {};
  food.x = Math.floor(Math.random() * gridSize);
  food.y = Math.floor(Math.random() * gridSize);
  snake.forEach((cell) => {
    if (isEqual(cell, food)) return generateFood(snake);
  });

  return food;
}

function isEqual(a, b) {
  if (a.x == b.x && a.y == b.y) return true;
  return false;
}
