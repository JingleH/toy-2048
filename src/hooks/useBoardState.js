import { useReducer, useEffect } from 'react';

function findUpCollide(board, row, col) {
  while (--row > 0) {
    if (board[row][col] != 0) return row;
  }
  return 0;
}

function findRightCollide(board, row, col) {
  const d = board.length;
  while (++col < d) {
    if (board[row][col] != 0) return col;
  }
  return d - 1;
}

function findDownCollide(board, row, col) {
  const d = board.length;
  while (++row < d) {
    if (board[row][col] != 0) {
      return row;
    }
  }
  return d - 1;
}

function findLeftCollide(board, row, col) {
  while (--col > 0) {
    if (board[row][col] != 0) return col;
  }
  return 0;
}

function moveUp(board, row, col) {
  if (row <= 0 || board[row][col] == 0) return;
  const val = board[row][col];
  const obstacleRow = findUpCollide(board, row, col);
  board[row][col] = 0;
  if (board[obstacleRow][col] == 0) {
    board[obstacleRow][col] = val;
  } else if (val == board[obstacleRow][col]) {
    board[obstacleRow][col] += val;
    return true;
  } else {
    board[obstacleRow + 1][col] = val;
  }
}

function moveRight(board, row, col) {
  const d = board.length;
  if (col >= d - 1 || board[row][col] == 0) return;
  const val = board[row][col];
  const obstacleCol = findRightCollide(board, row, col);
  board[row][col] = 0;
  if (board[row][obstacleCol] == 0) {
    board[row][obstacleCol] = val;
  } else if (val == board[row][obstacleCol]) {
    board[row][obstacleCol] += val;
    return true;
  } else {
    board[row][obstacleCol - 1] = val;
  }
}

function moveDown(board, row, col) {
  const d = board.length;
  if (row >= d - 1 || board[row][col] == 0) return;
  const val = board[row][col];
  const obstacleRow = findDownCollide(board, row, col);
  board[row][col] = 0;
  if (board[obstacleRow][col] == 0) {
    board[obstacleRow][col] = val;
  } else if (val == board[obstacleRow][col]) {
    board[obstacleRow][col] += val;
    return true;
  } else {
    board[obstacleRow - 1][col] = val;
  }
}

function moveLeft(board, row, col) {
  if (col <= 0 || board[row][col] == 0) return;
  const val = board[row][col];
  const obstacleCol = findLeftCollide(board, row, col);
  board[row][col] = 0;
  if (board[row][obstacleCol] == 0) {
    board[row][obstacleCol] = val;
  } else if (val == board[row][obstacleCol]) {
    board[row][obstacleCol] += val;
    return true;
  } else {
    board[row][obstacleCol + 1] = val;
  }
}

function addRandomNum(board) {
  const d = board.length;
  const pool = [];
  let max = 0;
  for (let row = 0; row < d; row++) {
    for (let col = 0; col < d; col++) {
      max = Math.max(max, board[row][col]);
      if (board[row][col] == 0) pool.push([row, col]);
    }
  }
  const [row, col] = pool[Math.floor(Math.random() * pool.length)];
  const randomNums = [2];
  if (max > 128) randomNums.push(4);
  if (max > 512) randomNums.push(8);
  board[row][col] = randomNums[Math.floor(Math.random() * randomNums.length)];
  return [row, col];
}

function sameBoards(board1, board2) {
  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1.length; j++) {
      if (board1[i][j] != board2[i][j]) return false;
    }
  }
  return true;
}

function getNextState(state, value) {
  const { board, scores } = state;
  const d = board.length;
  const newBoard = [];
  for (let i = 0; i < d; i++) {
    newBoard.push(new Uint16Array(d));
    for (let j = 0; j < d; j++) {
      newBoard[i][j] = board[i][j];
    }
  }
  let newScores = scores;
  switch (value) {
    case 0:
      for (let row = 0; row < d; row++) {
        for (let col = 0; col < d; col++) {
          const val = newBoard[row][col];
          if (moveUp(newBoard, row, col)) newScores += val * 2;
        }
      }
      break;
    case 1:
      for (let col = d - 1; col >= 0; col--) {
        for (let row = 0; row < d; row++) {
          const val = newBoard[row][col];
          if (moveRight(newBoard, row, col)) newScores += val * 2;
        }
      }
      break;
    case 2:
      for (let row = d - 1; row >= 0; row--) {
        for (let col = 0; col < d; col++) {
          const val = newBoard[row][col];
          if (moveDown(newBoard, row, col)) newScores += val * 2;
        }
      }
      break;
    case 3:
      for (let col = 0; col < d; col++) {
        for (let row = 0; row < d; row++) {
          const val = newBoard[row][col];
          if (moveLeft(newBoard, row, col)) newScores += val * 2;
        }
      }
      break;
    default:
      return state;
  }
  if (sameBoards(board, newBoard)) {
    return state;
  }
  const added = addRandomNum(newBoard);
  return { added, board: newBoard, scores: newScores };
}

const getReducer =
  (d) =>
  (state, { type, value }) => {
    switch (type) {
      case 'RESET':
        return initializer(d);
      case 'SWIPE':
        const nextState = getNextState(state, value);
        return nextState;
      case 'UNDO':
      // return state;
      default:
        return state;
    }
  };

const WIN = 2048;

function initializer(d) {
  const board = [];
  for (let i = 0; i < d; i++) {
    board.push(new Uint16Array(d));
    board[board.length - 1].fill(0);
  }
  const added = addRandomNum(board);
  return { board, added, scores: 0 };
}

export default function useBoardState(d = 4) {
  const [state, dispatch] = useReducer(getReducer(d), d, initializer);
  const handleKeyDown = ({ key }) => {
    if (key === 'ArrowUp' || key === 'w') {
      dispatch({ type: 'SWIPE', value: 0 });
    } else if (key === 'ArrowRight' || key === 'd') {
      dispatch({ type: 'SWIPE', value: 1 });
    } else if (key === 'ArrowDown' || key === 's') {
      dispatch({ type: 'SWIPE', value: 2 });
    } else if (key === 'ArrowLeft' || key === 'a') {
      dispatch({ type: 'SWIPE', value: 3 });
    } else if (key === 'r') {
      dispatch({ type: 'RESET' });
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (state.failed) console.log('failed!');
  }, [state.failed]);
  return [state, dispatch];
}
