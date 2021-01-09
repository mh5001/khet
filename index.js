const Piece = require('./lib/Piece');
const boardSetup = require('./lib/boardSetup.json');

module.exports = class Board {
    constructor() {
        this.board = createBoard();
        this.pieces = [];
        // Black 2 White 1
        this.turn = {
            color: 1,
            canMove: true
        };
        this.gameState = {
            isOver: false,
            winner: null
        };
    }

    setupBoard(setupName) {
        const setup = boardSetup[setupName];
        this.pieces.length = 0;
        setup.deflector.forEach(d => {
            const pb = new Piece.Deflector(d[0], d[1], d[2], 2, this.board, this.turn);
            const pw = new Piece.Deflector(9 - d[0], 7 -d[1], (d[2] + 180) % 360, 1, this.board, this.turn);
            this.addPiece(pb);
            this.addPiece(pw);
        });
        setup.switch.forEach(d => {
            const pb = new Piece.Switch(d[0], d[1], d[2], 2, this.board, this.turn);
            const pw = new Piece.Switch(9 - d[0], 7 -d[1], (d[2] + 180) % 360, 1, this.board, this.turn);
            this.addPiece(pb);
            this.addPiece(pw);
        });
        setup.defender.forEach(d => {
            const pb = new Piece.Defender(d[0], d[1], d[2], 2, this.board, this.turn);
            const pw = new Piece.Defender(9 - d[0], 7 -d[1], (d[2] + 180) % 360, 1, this.board, this.turn);
            this.addPiece(pb);
            this.addPiece(pw);
        });
        setup.king.forEach(d => {
            const pb = new Piece.King(d[0], d[1], d[2], 2, this.board, this.turn);
            const pw = new Piece.King(9 - d[0], 7 -d[1], (d[2] + 180) % 360, 1, this.board, this.turn);
            this.addPiece(pb);
            this.addPiece(pw);
        });

        const pb = new Piece.Laser(0, 0, 180, 2, this.board, this.turn, this.gameState);
        const pw = new Piece.Laser(9, 7, 0, 1, this.board, this.turn, this.gameState);
        this.addPiece(pb);
        this.addPiece(pw);
    }

    addPiece(piece) {
        this.pieces.push(piece);
        this.board[piece.pos.y][piece.pos.x] = piece;
    }

    getPiece(pos) {
        const p = this.board[pos.y][pos.x];
        if (p.color === this.turn.color) return p;
        else return '';
    }

    fireLaser() {
        if (this.turn.canMove) return [];
        const pos = this.turn.color === 1 ? {x: 9, y: 7} : {x: 0, y: 0};
        this.updateTurn();

        return this.board[pos.y][pos.x].fireLaser();
    }

    updateTurn() {
        if (this.turn.color === 1) this.turn.color = 2;
        else this.turn.color = 1;

        this.turn.canMove = true;
    }

    simplifyBoard() {
        let board = createBoard();
        this.board.forEach((row, j) => {
            row.forEach((e, i) => {
                if (e === '') board[j][i] = '';
                else {
                    board[j][i] = [e.pieceName, e.pos.angle];
                }
            });
        });
        return board;
    }
}

function createBoard() {
    const board = [];
    for (let i = 0; i < 8; i++) {
        const row = []
        for (let j = 0; j < 10; j++) {
            row.push("");
        }
        board.push(row);
    }
    return board;
}