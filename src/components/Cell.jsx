import { useContext } from 'react';
import { BoardContext } from './Board';
import './Cell.css';
export default function Cell({ num, row, col }) {
  const { added } = useContext(BoardContext);
  const fresh = row == added[0] && col == added[1];
  let cls = `cell`;
  if (fresh) cls += ' fresh';
  return <div className={cls}>{num}</div>;
}
