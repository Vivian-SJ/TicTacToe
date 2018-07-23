import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    if (props.highlight) {
        return (
            <button
                className="square"
                onClick={props.onClick}
                style={{ color: "red" }}
            >
                {props.value}
            </button>
        );
    } else {
        return (
            <button
                className="square"
                onClick={props.onClick}
            >
                {props.value}
            </button>
        );
    }
    
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={this.props.winLine.includes(i)}
            />);
    }



    render() {
        var rows = [];
        for (var i = 0; i < 3; i++) {
            var row = [];
            for (var j = 0; j < 3; j++) {
                row.push(this.renderSquare(i * 3 + j));
            }
            rows.push(<div className="board-row" key={i * 3 + j}>{row}</div>);
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    desc: 'Game start',
                    stepNum: 0
                }
            ],
            stepNum: 0,
            xIsNext: true,
            sort: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || calculateWinner(squares).length>0) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                desc: squares[i] + ' moved to' + '(' + Math.floor(i / 3) + ',' + (i % 3 + 1) + ')',
                stepNum: history.length
            }]),
            stepNum: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNum: step,
            xIsNext: (step % 2) ? false : true
        });
    }
    render() {
        var history = this.state.history;
        const current = history[this.state.stepNum];
        const winInfo = calculateWinner(current.squares);

        if (this.state.sort) {
            history = history.slice();
            history.reverse();
        }

        const moves = history.map((step, move) => {
            const desc = step.desc;
           
            if (step.stepNum === this.state.stepNum) {
                    return (
                        <li key={step.stepNum}>
                            <a href='#' onClick={() => this.jumpTo(step.stepNum)}><strong>{desc}</strong></a>
                        </li>
                    )
                }
            
           
            return (
                <li key={step.stepNum}>
                    <a href='#' onClick={() => this.jumpTo(step.stepNum)}>{desc}</a>
                </li>
            )
        })

        let status;
        var winLine = [];
        if (winInfo.length>0) {
            status = 'Winner: ' + winInfo[0];
            winLine = winInfo.slice(1, 4);
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div>
                    <button onClick={() => this.sort()}>sort</button>
                </div>
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    sort() {
        this.setState({
            sort: !this.state.sort
        })
    }
}

function calculateWinner(squares) {
    //ʤ?????????һ???һ?л????    
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    var result = [];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            result.push(squares[a], a, b, c);
            return result;
        }
    }
    return result;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);