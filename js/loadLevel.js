/*
 * Loads level onto a board.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *
 * -------------------------------------------------------------------
 *
 * var levelString = '6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531';
 * var pieceString =        0021;
 *
 * 6        Number of tiles - assumed square
 *
 * 5, 2     Goal X & Y Coordinate (Where the Jeep is suppose to go)
 *          [x, y] : [5, 2]
 *
 * 0013     Top left tile of piece [x, y] : [0, 0]
 *  .       Width and height of piece [w, h] : [1, 3]
 *  .
 * 1221j    The 'j' stands for Jeep. Every level must have 1 Jeep.
 */

(function() {

/**
 * Create accesspoints outside of loadLevel.js
 */
function setGlobalsAndLoadBoard() {
    window.sr = {};

    // Add functions to sr object
    window.sr.setBoard      = setBoard;
    window.sr.loadLevel     = loadLevel;

    // Add vars and properties to sr object
    window.sr.JEEP_ID       = JEEP_ID;
    window.sr.PIECE_CLASSES = PIECE_CLASSES;

    // Load level one after document loads
    $(document).ready(function() {

        // Temporary level 1 string
        var lvl1 = '6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531';
        sr.setBoard();
        sr.loadLevel(lvl1);
    });
}

// ----------------------------------------------------------
//                     V A R I A B L E S
// ----------------------------------------------------------

var
    BOARD_ID        = 'gameBoard',
    BOARD,          // Board element
    GET_LEVEL_URL   = 'http://team23.site88.net/demo/getLevel.php',

    level,           // Level object
    tileLengthPx;    // Length of tile in px

var
    JEEP_ID         = 'JEEP',

    // Class names assigned to different pieces
    PIECE_CLASSES = {
        ALL:        'piece',    // Assigned to all pieces
        HORIZONTAL: 'dragX',    // Only for horizontal moving pieces
        VERTICAL:   'dragY',    // Only for vertical moving pieces
        SIZE:       ['', '', 'size2', 'size3']  // No size 0 and 1
    };

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Sets board height to its width. (Makes it a square.)
 */
function setBoard() {
    BOARD = $('#' + BOARD_ID),
    BOARD.height(BOARD[0].offsetWidth);
}

/**
 * Get levelString from backend and invoke loadLevelFromString().
 */
function loadLevel(levelNum) {
    loadLevelFromString(levelNum);

    // GETS LEVEL STRING FROM BACKEND:

    // if (!levelNum) {
    //     loadLevelFromString();
    // } else {
    //     var getLevelURL = GET_LEVEL_URL + '?level=' + levelNum;
    //     sr.ajaxGet(getLevelURL, loadLevelFromString);
    // }
}

/**
 * Load level pieces onto the board and invoke
 * sr.loadMechanics() after pieces finish loading.
 */
function loadLevelFromString(levelString) {
    if (levelString) {
        var resetMoveCounter = true;

        level = createLevel(levelString.trim());
        tileLengthPx = BOARD[0].offsetWidth / level.boardLength;
    }

    BOARD.empty();

    for (var i = 0; i < level.pieces.length; i++) {
        loadPiece(level.pieces[i]);
    }

    // Might need to set a delay incase images not loaded
    sr.loadMechanics(level.goalX, level.goalY, resetMoveCounter);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Loads a piece into the HTML DOM.
 */
function loadPiece(piece) {

    // Class names applied to piece
    var orientation = (piece.w == 1) ? PIECE_CLASSES.VERTICAL : PIECE_CLASSES.HORIZONTAL;
    var pieceSize   = PIECE_CLASSES.SIZE[Math.max(piece.w, piece.h)];
    var classNames  = PIECE_CLASSES.ALL + ' ' + orientation + ' ' + pieceSize;

    var pieceElement = $('<div></div>')
        .addClass(classNames)
        .css({
            width:  piece.w * tileLengthPx,
            height: piece.h * tileLengthPx,
            left:   piece.x * tileLengthPx,
            top:    piece.y * tileLengthPx,
        });

    sr.loadPieceAsset(piece, pieceElement, BOARD);

    BOARD.append(pieceElement);
}

/**
 * Create and returns a level (data object).
 */
function createLevel(levelString) {
    var parts = levelString.split(',');
    var pieces = [];

    for (var i = 3; i < parts.length; i++) {
        var id    = i - 3;
        var piece = createPiece(parts[i]);
        pieces.push(piece);
    }

    return {
        boardLength:  parts[0],
        goalX:        parts[1],
        goalY:        parts[2],
        pieces:       pieces
    };
}

/**
 * Create and returns a piece (data object).
 */
function createPiece(pieceString) {
    return {
        x: parseInt(pieceString[0]),
        y: parseInt(pieceString[1]),
        w: parseInt(pieceString[2]),
        h: parseInt(pieceString[3]),
        isJeep: pieceString[4] ? true : false
    };
}

// Set global variables
setGlobalsAndLoadBoard();

})();
