
export type Player = 'X' | 'O';
export type SquareState = 'X' | 'O' | ' ';
export type RowState = [SquareState, SquareState, SquareState];
export type BoardState = [RowState, RowState, RowState];

export type OngoingGame = { type: "ongoing", turn: Player, board: BoardState };
export type SettledGame = { type: "settled", winner: Player, board: BoardState };
export type TiedGame = { type: "tied", board: BoardState };
export type GameState = OngoingGame | SettledGame | TiedGame;

export const EmptyBoardState: BoardState = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
export const EmptyState: GameState = { type: "ongoing", turn: 'X', board: EmptyBoardState };

export const selectCell = (gameState: OngoingGame, rowIndex: number, columnIndex: number): GameState => {
    if (isFreeCell(gameState.board[rowIndex][columnIndex]) == false) {
        return gameState;
    }
    const newBoard = setSquareState(gameState.board, rowIndex, columnIndex, gameState.turn);
    const settled = isSettled(newBoard);
    if (settled) {
        return {
            type: "settled",
            winner: gameState.turn,
            board: newBoard
        };
    }
    else if (hasFreeCells(newBoard) == false) {
        return {
            type: "tied",
            board: newBoard
        };
    }
    else {
        return {
            type: "ongoing",
            board: newBoard,
            turn: gameState.turn == 'X' ? 'O' : 'X'
        }
    }
}

const setRowState = (row: RowState, columnIndex: number, square: SquareState): RowState =>
    [
        columnIndex == 0 ? square : row[0],
        columnIndex == 1 ? square : row[1],
        columnIndex == 2 ? square : row[2]
    ];

const setSquareState = (board: BoardState, rowIndex: number, columnIndex: number, square: SquareState): BoardState =>
    [
        rowIndex == 0 ? setRowState(board[0], columnIndex, square) : board[0],
        rowIndex == 1 ? setRowState(board[1], columnIndex, square) : board[1],
        rowIndex == 2 ? setRowState(board[2], columnIndex, square) : board[2]
    ];

const isRowSettled = (row: RowState) =>
    row[0] != ' ' && row[0] == row[1] && row[1] == row[2];

const isColumnSettled = (board: BoardState, columnIndex: number) =>
    board[0][columnIndex] != ' ' && board[0][columnIndex] == board[1][columnIndex] && board[1][columnIndex] == board[2][columnIndex];

const isDiagonalSettled = (board: BoardState) =>
    (board[0][0] != ' ' && board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
    (board[0][2] != ' ' && board[0][2] == board[1][1] && board[1][1] == board[2][0]);

const isSettled = (board: BoardState) =>
    isRowSettled(board[0]) || isRowSettled(board[1]) || isRowSettled(board[2]) ||
    isColumnSettled(board, 0) || isColumnSettled(board, 1) || isColumnSettled(board, 2) ||
    isDiagonalSettled(board);

const isFreeCell = (c: SquareState) => c == ' ';

const hasFreeCells = (board: BoardState) => board.some(row => row.some(isFreeCell));
