const SWITCH_VALID = ['', 'e', 'f']

class Piece {
    constructor (x, y, o, c, b, t) {
        this.pos = {
            x: x,
            y: y,
            angle: o
        };
        // Black 2 White 1
        this.color = c;
        this.board = b;
        this.currentTurn = t;
    }

    movePiece(pos) {
        const validMoves = this.getValidMoves();
        let isValidMove = false;
        for (let i = 0; i < validMoves.length; i++) {
            const m = validMoves[i];
            if (m.x === pos.x && m.y === pos.y) {
                isValidMove = true;
                break;
            }
        }
        if (isValidMove) {
            const temp = this.board[pos.y][pos.x];
            this.board[pos.y][pos.x] = this;
            this.board[this.pos.y][this.pos.x] = temp;
            this.pos.x = pos.x;
            this.pos.y = pos.y;
            this.currentTurn.canMove = false;
        }
        return isValidMove;
    }

    rotatePiece(direction) {
        const angle = direction * -90;
        this.pos.angle += angle;
        if (this.pos.angle < 0) this.pos.angle = 270;
        this.pos.angle %= 360;
        this.currentTurn.canMove = false;
    }

    getValidMoves() {
        if (!this.currentTurn.canMove) return;
        if (this.currentTurn.color !== this.color) return;
        let validMoves = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                const p = {
                    x: this.pos.x + j,
                    y: this.pos.y + i
                };
                if ((this.color === 2 && p.x === 9) || (this.color === 1 && p.x === 0)) continue;
                if (p.x > 9 || p.x < 0 || p.y > 7 || p.y < 0) continue;
                if (p.x === 1 && this.color === 2) {
                    if (p.y === 0 || p.y === 7) continue;
                }
                if (p.x === 8 && this.color === 1) {
                    if (p.y === 0 || p.y === 7) continue;
                }

                if (this.board[p.y][p.x] === '') validMoves.push(p);
            }
        }
        return validMoves;
    }
    
}

module.exports['King'] = class King extends Piece {
    constructor(x, y, o, c, b, t) {
        super(x, y, o, c, b, t);
        this.pieceName = this.color === 1 ? 'K' : 'k';
    }
}

module.exports['Switch'] = class Switch extends Piece {
    constructor(x, y, o, c, b, t) {
        super(x, y, o, c, b, t);
        this.pieceName = this.color === 1 ? 'S' : 's';
    }

    getValidMoves() {
        let validMoves = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                const p = {
                    x: this.pos.x + i,
                    y: this.pos.y + j
                };
                if (this.board[p.y][p.x] === "") validMoves.push(p);
                else if (SWITCH_VALID.includes(this.board[p.y][p.x].pieceName.toLowerCase())) validMoves.push(p);
            }
        }
        return validMoves;
    }

    deflectLaser(laserVelocity) {
        if (laserVelocity.x === 1 && laserVelocity.y === 0) {
            if (this.pos.angle === 180) this.pos.angle = 0;
            if (this.pos.angle === 270) this.pos.angle = 90;
            return {x: 0, y: (this.pos.angle === 0) ? -1 : 1};
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === 1) {
            if (this.pos.angle === 180) this.pos.angle = 0;
            if (this.pos.angle === 90) this.pos.angle = 270;
            return {x: (this.pos.angle === 0) ? -1 : 1, y: 0};
        }
        else if (laserVelocity.x === -1 && laserVelocity.y === 0) {
            if (this.pos.angle === 0) this.pos.angle = 180;
            if (this.pos.angle === 90) this.pos.angle = 270;
            return {x: 0, y: (this.pos.angle === 180) ? 1 : -1};
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === -1) {
            if (this.pos.angle === 0) this.pos.angle = 180;
            if (this.pos.angle === 270) this.pos.angle = 90;
            return {x: (this.pos.angle === 180) ? 1 : -1, y: 0};
        }
    }
}

module.exports['Defender'] = class Defender extends Piece {
    constructor(x, y, o, c, b, t) {
        super(x, y, o, c, b, t);
        this.pieceName = this.color === 1 ? 'E' : 'e';
    }

    getHit(laserVelocity) {
        if (laserVelocity.x === 1 && laserVelocity.y === 0) {
            return this.pos.angle === 90;
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === 1) {
            return this.pos.angle === 0;
        }
        else if (laserVelocity.x === -1 && laserVelocity.y === 0) {
            return this.pos.angle === 270;
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === -1) {
            return this.pos.angle === 180;
        }
    }
}

module.exports['Deflector'] = class Deflector extends Piece {
    constructor(x, y, o, c, b, t) {
        super(x, y, o, c, b, t);
        this.pieceName = this.color === 1 ? 'F' : 'f';
    }

    deflectLaser(laserVelocity) {
        // I could have convert the directional vector to angle and compare
        // if they are 90 degree to the piece, but I wrote this bullshit and dont want to change it
        if (laserVelocity.x === 1 && laserVelocity.y === 0) {
            if (this.pos.angle === 90 || this.pos.angle === 0) {
                return {x: 0, y: (this.pos.angle === 0) ? -1 : 1};
            } else {
                return false;
            }
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === 1) {
            if (this.pos.angle === 0 || this.pos.angle === 270) {
                return {x: (this.pos.angle === 0) ? -1 : 1, y: 0};
            } else {
                return false;
            }
        }
        else if (laserVelocity.x === -1 && laserVelocity.y === 0) {
            if (this.pos.angle === 180 || this.pos.angle === 270) {
                return {x: 0, y: (this.pos.angle === 180) ? 1 : -1};
            } else {
                return false;
            }
        }
        else if (laserVelocity.x === 0 && laserVelocity.y === -1) {
            if (this.pos.angle === 180 || this.pos.angle === 90) {
                return {x: (this.pos.angle === 180) ? 1 : -1, y: 0};
            } else {
                return false;
            }
        }
    }
}

module.exports['Laser'] = class Laser extends Piece {
    constructor(x, y, o, c, b, t, s) {
        super(x, y, o, c, b, t);
        this.pieceName = this.color === 1 ? 'A' : 'a';
        this.gameState = s;
    }

    movePiece() {}

    getValidMoves() {
        return [];
    }

    fireLaser() {
        let laserMove = [];
        let laserPosition = {
            x: this.pos.x,
            y: this.pos.y
        };
        let laserVelocity = {
            x: 0,
            y: 0
        };
        laserVelocity.y = this.color === 1 ? -1 : 1;
        while (true) {
            laserPosition.x += laserVelocity.x;
            laserPosition.y += laserVelocity.y;
            if (laserPosition.x < 0 || laserPosition.x > 9) break;
            if (laserPosition.y < 0 || laserPosition.y > 7) break;
            laserMove.push({
                x: laserPosition.x,
                y: laserPosition.y
            });

            const p = this.board[laserPosition.y][laserPosition.x];
            if (p !== '') {
                if (p.pieceName.toLowerCase() === 'f' || p.pieceName.toLowerCase() === 's') {
                    const deflection = p.deflectLaser(laserVelocity);
                    if (deflection) laserVelocity = deflection;
                    else {
                        this.board[laserPosition.y][laserPosition.x] = '';
                        break;
                    }
                } else if (p.pieceName.toLowerCase() === 'e') {
                    const deflection = p.getHit(laserVelocity);
                    if (!deflection) this.board[laserPosition.y][laserPosition.x] = '';
                    break;
                } else if (p.pieceName.toLowerCase() === 'k') {
                    this.gameState.isOver = true;
                    this.gameState.winner = p.pieceName === p.pieceName.toLowerCase() ? 1 : 2;
                }
            }
        }

        return laserMove;
    }
}