import React, { Component } from 'react';

import Board from '../../components/Board';
import { calculateWinner } from '../../utils';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    // copy the state.squares array
    const squares = current.squares.slice();

    // check if there is a winner or if the clicked square has already been clicked
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    // check who is the next player and
    // update the copy of the state which is going to be the next state
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares
      }]),

      stepNumber: history.length,
      
      // change the next player
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // se o número de jogadas (step) for par, xIsNext recebe true 
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move) } >{desc}</button>
        </li>
      )
    })

    let status;
    if(winner) {
      status = 'Winner :' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;