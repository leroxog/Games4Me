export function createSnake(cols, rows) {
  const mid = Math.floor(cols / 2);
  return [
    { x: mid,     y: Math.floor(rows / 2) },
    { x: mid - 1, y: Math.floor(rows / 2) },
    { x: mid - 2, y: Math.floor(rows / 2) },
  ];
}

export function placeFood(snake, cols, rows) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function isOutOfBounds(head, cols, rows) {
  return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
}

export function isSelfCollision(snake, head) {
  return snake.some(s => s.x === head.x && s.y === head.y);
}

export function step(snake, dir, food, cols, rows) {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (isOutOfBounds(head, cols, rows) || isSelfCollision(snake, head)) {
    return { snake, food, score: null, gameOver: true };
  }

  const newSnake = [head, ...snake];
  const ateFood = head.x === food.x && head.y === food.y;

  if (!ateFood) newSnake.pop();

  return {
    snake: newSnake,
    food: ateFood ? placeFood(newSnake, cols, rows) : food,
    ateFood,
    gameOver: false,
  };
}

export function isOpposite(dir, newDir) {
  return dir.x === -newDir.x && dir.y === -newDir.y;
}
