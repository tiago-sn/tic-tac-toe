import React, { Component } from 'react';

import Board from '../../components/Board';
import { calculateWinner } from '../../utils';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        boardState: Array(9).fill(null)
      }],
      rounds: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const { history, rounds } = this.state;

    // This is needed when the user go back in a past move.
    const newHistory = this.updateHistory(history, rounds); 
    const currentMove = newHistory[rounds];

    // copy the part of the state to be updated
    const boardState = currentMove.boardState.slice();

    // check if there is a winner or if the clicked square has already been clicked
    if(calculateWinner(boardState) || boardState[i]) {
      return;
    }

    const newBoardState = this.updateBoardState(boardState, i);
    this.makeMove(newHistory, newBoardState);
  }

  /**
   * @param {array} newHistory 
   * @param {object} boardState 
   */
  makeMove(history, newBoardState) {
    this.setState({
      history: history.concat([{
        boardState: newBoardState
      }]),
      rounds: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  /**
   * Take a board state and a put the current player symbol in the board.
   * @param {array} boardState 
   * @param {number} square 
   */
  updateBoardState(boardState, square) {
    boardState[square] = this.state.xIsNext ? 'X' : 'O';
    return boardState;
  }

  /**
   * This function takes a history array, a step number and returns a new history array with the
   * current state, i.e. the last element of the array, in sync with that given step number.
   * This is needed when the user "go back in time" by clicking in the list of the last steps.
   * @param {Array} history
   * @param {number} rounds 
   */
  updateHistory(history, rounds) {
    return history.slice(0, rounds + 1);
  }

  jumpTo(round) {
    this.setState({
      rounds: round,
      // se o número de jogadas (round) for par, xIsNext recebe true 
      xIsNext: (round % 2) === 0
    })
  }

  render() {
    const { history, rounds } = this.state;
    const currentMove = history[rounds];
    const winner = calculateWinner(currentMove.boardState);

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
            squares={currentMove.boardState}
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