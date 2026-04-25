export const PIECES = [
  [[1,1,1,1]],
  [[2,2],[2,2]],
  [[0,3,0],[3,3,3]],
  [[0,4,4],[4,4,0]],
  [[5,5,0],[0,5,5]],
  [[6,0,0],[6,6,6]],
  [[0,0,7],[7,7,7]],
];

export function newBoard(cols, rows) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function rotate(piece) {
  return piece[0].map((_, i) => piece.map(r => r[i]).reverse());
}

export function collides(piece, board, px, py) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (!piece[r][c]) continue;
      if (py + r >= rows || px + c < 0 || px + c >= cols) return true;
      if (py + r >= 0 && board[py + r][px + c]) return true;
    }
  }
  return false;
}

export function mergePiece(board, piece, px, py) {
  const next = board.map(r => [...r]);
  piece.forEach((row, r) => row.forEach((v, c) => {
    if (v) next[py + r][px + c] = v;
  }));
  return next;
}

export function clearLines(board) {
  const kept = board.filter(row => row.some(v => v === 0));
  const cleared = board.length - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(board[0].length).fill(0));
  return { board: [...empty, ...kept], cleared };
}

export function scoreForLines(cleared, level) {
  const pts = [0, 100, 300, 500, 800];
  return (pts[cleared] || 800) * level;
}

export function randomPiece() {
  return PIECES[Math.floor(Math.random() * PIECES.length)].map(r => [...r]);
}
