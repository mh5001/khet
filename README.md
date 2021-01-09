# Khet (Laser Chess)
A pure Khet library with 0 dependencies written in Node.js

## Description
https://en.wikipedia.org/wiki/Khet_(game)

# Installation
```npm i khet```

## Usage
To create a game
```js
const Khet = require('khet');
const game = new Khet();
```

## Khet Methods
### To create a game:

`game.setupBoard(boardSetup) : null`

#### boardSetup : String
Name of the board, availabe setups are:
* ACE

### Create a simple display of the board:

`game.simplifyBoard() : Array`

### Get Piece

`game.getPiece(pos) : Piece`

#### pos : Object
Position of the piece. e.g:
`{ x: 5, y: 6}`

### Fire laser
`game.fireLaser() : Array`

### Change player's turn
`game.updateTurn() : null`

## Khet Properties
* board : Array - Unsimplified board array (10x8)
* turn : Object - Properties: 
    * color : Number - Current player turn (1: White, 2: Black)
    * canMove : Bool - If the current player still have a move turn
* gameState : Oject - State of the game
    * isOver : Bool - true if game is over
    * winner : Number - The winner of the game

## Piece Method

`movePiece(pos) : Bool`
Move the piece

`rotatePiece(direction) : null`
Rotate the piece. direction is number, -1 for anti-clockwise, 1 for clockwise

`getValidMoves() : Pos array`
Get a list of valid squares that the piece can move to

## Piece Properties
* pos : Object
    * x : Number
    * y: Number
    * angle : Number - In Degree
* color : Number
