
import { BoardState, GameState, OngoingGame, EmptyState, selectCell } from "./toe";

const getKey = (board: BoardState) => board.map(row => row.map(s => s == ' ' ? '_' : s).join('')).join('');

const data: { [key: string]: number[] } = {};

export const logGame = (gameStates: GameState[]) => {

    const last = gameStates[gameStates.length - 1];

    if (last.type == "ongoing") {
        return;
    }

    const aiPlayer = 'O';
    const won = last.type == "settled" ? last.winner == aiPlayer : true;

    for (let i = 0; i < gameStates.length; i++) {
        const state = gameStates[i];

        if (state.type == "ongoing") {

            if (state.turn == aiPlayer) {

                const next = gameStates[i + 1];

                const key = getKey(state.board);
                if (key.length != 9)
                    throw new Error("invalid key");
                const choice = findChoice(state.board, next.board);
                if (choice == -1) {
                    console.log("unknown move")
                    return;
                }
                
                const d = data[key] || validChoices(state.board);
                d[choice] = Math.max(1, d[choice] + (won ? 3 : -1));
                data[key] = d;
            }
        }
    }
};

const validChoices = (board: BoardState) => {
    return [
        board[0][0] == ' ' ? 5 : 0,
        board[0][1] == ' ' ? 5 : 0,
        board[0][2] == ' ' ? 5 : 0,

        board[1][0] == ' ' ? 5 : 0,
        board[1][1] == ' ' ? 5 : 0,
        board[1][2] == ' ' ? 5 : 0,

        board[2][0] == ' ' ? 5 : 0,
        board[2][1] == ' ' ? 5 : 0,
        board[2][2] == ' ' ? 5 : 0
    ]
};

const moveMap = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },

    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },

    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
];

export const suggestMove = (game: OngoingGame) => {
    const state = game.board;

    const key = getKey(state);

    if (!(key in data)) {
        return randomMove(state);
    }
    
    const statePlayData = data[key];
    const sum = statePlayData.reduce((p, v) => p + v);
    const values = statePlayData
        .map((v, i) => ({ v: v / sum, i }))
        .sort((a, b) => a.v < b.v ? 1 : a.v > b.v ? -1 : 0);

    let r = Math.random();
    for (let v of values) {
        if (r > v.v)
            r -= v.v;
        else
            return moveMap[v.i];
    }

    throw new Error("could not suggest move")
};

const randomMove = (state: BoardState) => {
    let result: { row: number, col: number };
    do {
        result = moveMap[Math.floor(9*Math.random())];
    } while (state[result.row][result.col] != ' ');
    return result;
};

const findChoice = (state: BoardState, next: BoardState) => {
    for (let i = 0; i <= 9; i++)
        if (state[Math.floor(i / 3)][i % 3] != next[Math.floor(i / 3)][i % 3])
            return i;
    return -1;
};

const simulateGame = () => {
    let game = EmptyState;
    let history = [game];
    while (game.type == "ongoing") {
        const move = game.turn == 'X' ? randomMove(game.board) : suggestMove(game);
        game = selectCell(game, move.row, move.col);
        history.push(game);
    }
    logGame(history);
};

for (let i=0; i<100000; i++)
    simulateGame();
