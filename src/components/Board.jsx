import { createContext } from 'react';
import useBoardState from '../hooks/useBoardState';
import Cell from './Cell';
import './Board.css';

export const DIMENSION = 4;

export const BoardContext = createContext();

export default function Board() {
  const [{ board, added, scores }] = useBoardState(DIMENSION);
  const rows = [];
  for (let i = 0; i < DIMENSION; i++) {
    const row = [];
    for (let j = 0; j < DIMENSION; j++) {
      row.push(<Cell key={j} num={board[i][j]} row={i} col={j} />);
    }
    rows.push(
      <div className='row' key={i}>
        {row}
      </div>,
    );
  }
  return (
    <div className='board'>
      <BoardContext.Provider value={{ added }}>
        <div className='scores'>Scores: {scores}</div>
        {rows}
      </BoardContext.Provider>
    </div>
  );
}
