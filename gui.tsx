
import { BoardState, RowState, EmptyState, selectCell, GameState } from "./toe";
import * as React from "react";
import * as ReactDOM from "react-dom";

const CellStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    margin: "2px",
    display: "inline-block",
    verticalAlign: "middle",
    backgroundColor: "silver"
};

const XCell = () => (
    <svg style={{ width: "100px", height: "100px" }}>
        <line x1="20" y1="20" x2="80" y2="80" stroke="gray" strokeWidth="20" />
        <line x1="20" y1="80" x2="80" y2="20" stroke="gray" strokeWidth="20" />
    </svg>);

const OCell = () => (
    <svg style={{ width: "100px", height: "100px" }}>
        <circle cx="50" cy="50" r="30" stroke="gray" fill="transparent" strokeWidth="20"/>
    </svg>);

const RenderCell = (props: { cell: string, cellClicked: () => void }): JSX.Element => (
    <div style={CellStyle} onClick={() => props.cellClicked()}>
        {
            props.cell == 'X' ? <XCell /> : 
            props.cell == 'O' ? <OCell /> : ''
        }
    </div>);

const RenderRow = (props: { row: RowState, cellClicked: (column: number) => void }) => (
    <div>
        {
            props.row.map((cell, c) => <RenderCell cellClicked={() => props.cellClicked(c)} key={c} cell={cell} />)
        }
    </div>);

const RenderBoard = (props: { state: BoardState, cellClicked: (row: number, column: number) => void }) => (
    <div>
        {
            props.state.map((row, r) => <RenderRow cellClicked={(column) => props.cellClicked(r, column)} key={r} row={row} />)
        }
    </div>);

class GameBoard extends React.Component<{}, { gameState: GameState }> {
    constructor(props: {}) {
        super(props);
        this.state = { gameState: EmptyState }
    }

    onCellClicked = (r: number, c: number) => {
        if (this.state.gameState.type == "settled")
            return;

        if (this.state.gameState.type == "tied")
            return;

        this.setState({ gameState: selectCell(this.state.gameState, r, c) });
    }

    render() {
        return (
            <div style={{ textAlign: "center", color: "gray", fontFamily: "sans-serif" }}>
                {
                    this.state.gameState.type == "settled" ?
                        <h1>Vinnare: {this.state.gameState.winner}</h1> :
                        this.state.gameState.type == "tied" ?
                            <h1>Oavgjort</h1> :
                            <h1>Nästa spelare: {this.state.gameState.turn}</h1>
                }

                <RenderBoard
                    state={this.state.gameState.board}
                    cellClicked={this.onCellClicked} />
            </div>);
    }
}

ReactDOM.render(<GameBoard />, document.querySelector("#root"));
