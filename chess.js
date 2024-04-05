//controller------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
let gameState = {
    "players": 2,
    "playerNames": ['',''],
    "playerColors": ['',''],
    "inputReceived":[false, false],
    "boardPositions": [[-5,-4,-3,-2,-1,-3,-4,-5],[-6,-6,-6,-6,-6,-6,-6,-6],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[6,6,6,6,6,6,6,6],[5,4,3,2,1,3,4,5]],
    "capturedPieces": [[],[]],
    "playerTurn": 1,
    "checkmate": false,
    "check": false,
    "pawnExchange": [false, []],
    "pawnFirstMove": [[-6,-6,-6,-6,-6,-6,-6,-6], [6,6,6,6,6,6,6,6]],
    "squareSelected": '0,0',
    "lastSquareSelected": '0,0'
}

//Pulls data from a JSON file titles "game_save.JSON". It then uses this data to update the current game state and modify the board.
//could potentially be used as the foundation for saving your game in a future version of the game
function get_data(){
    let dataRequest = new XMLHttpRequest();
    dataRequest.open("GET", "game_save.JSON", false);
    dataRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    dataRequest.send();
    if (dataRequest.status === 200) {
        let gameData = JSON.parse(dataRequest.responseText);
        update_game(gameData);
    }
}

function update_game(object){
    console.log(object)
    gameState.boardPositions= object.gameState.boardPositions;
    gameState.capturedPieces= object.gameState.capturedPieces;
    gameState.playerNames= object.playerInfo.playerNames;
    gameState.playerColors= object.playerInfo.playerColors;
    gameState.pawnFirstMove= object.playerInfo.pawnFirstMove;

    update_player_customs();
    fillBoard();
    fillCaptures();
}


//reviews whether a player has moved a pawn (6, -6) to either the 0 row or the 7 row for a pawn exchange. If so, it calls
//the pawnExchange() function to execute the trade and update the boardPositions
function pawnExchangerChecker(){
    let boardEdges = []
    if (gameState.playerTurn === 1){
        boardEdges= gameState.boardPositions[0];
    } else{
        boardEdges= gameState.boardPositions[7];
    }
    let index= 0
    for (index= 0; index<boardEdges.length; index++){
        if ([6*gameState.playerTurn].includes(boardEdges[index])){
            gameState.pawnExchange[0]= true;
            pawnExchange(index);
        }
    }
    changeTurn(gameState.playerTurn);
}

//turns a pawn piece(6,-6) into another piece of player's choice. Calls the exchangePrompt() to get player input
function pawnExchange(index) {
    let newPiece= exchangePrompt(gameState.playerTurn);

    if (gameState.playerTurn === 1){
        gameState.boardPositions[0][index]= newPiece;
    } else{
        gameState.boardPositions[7][index]= newPiece;
    }
}

//return's the number of the piece at any given grid row/col coordinate by parsing through the boardPositions array
function getLocation(row, col) {
    return gameState.boardPositions[row][col];
}

//parses through the boardPositions to determine which pawns are eligible for the first move double move
function pawnFirstMoveChecker(){
    let whitePawns= gameState.boardPositions[1];
    let blackPawns= gameState.boardPositions[6];
    let bpawns = [];
    let wpawns = [];
    for (const number of whitePawns){
        let num = number;
        if ([-6].includes(num)){
            wpawns.push(num);
        }else{
            num = 0
            wpawns.push(num);
        }
    }
    for (const number of blackPawns){
        let num = number;
        if ([6].includes(num)){
            bpawns.push(num);
        }else{
            num = 0
            bpawns.push(num);
        }
    }
    gameState.pawnFirstMove= [[wpawns],[bpawns]]
}


//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
let oldLocations= [];
let oldClasses= [];
let current_piece;
let current_square;

function display_storage(){
    let login_info = localStorage.getItem('cs2550timestamp');
    document.getElementById("user_storage").innerHTML= login_info;
}

function clear_storage(){
    localStorage.clear();
}

//simple function to determine whether the input number is even or not. Used for the grid's alternating colors
function isEven(number){
    return number % 2 === 0;
}

class chessPiece{
    //color= color of the piece. shape= hmtl code that creates a chess piece image. alive= captured or not
    //moves= valid moves for this piece (unfinished). empty= if there is no piece there

    constructor(color= '', shape= '',  name= "") {
        this.color= String(color);
        this.shape= String(shape);
        this.name= String(name);
    }
}

wKing= new chessPiece('gold', '&#x2654', "King");
wQueen= new chessPiece('gold', '&#x2655', "Queen");
wBishop= new chessPiece('gold', '&#x2657', "Bishop");
wKnight= new chessPiece('gold', '&#x2658', "Knight");
wRook= new chessPiece('gold', '&#x2656', "Rook");
wPawn= new chessPiece('gold', '&#x2659', "Pawn");
bKing= new chessPiece('fuchsia', '&#x265A',"King");
bQueen= new chessPiece('fuchsia', '&#x265B', "Queen");
bBishop= new chessPiece('fuchsia', '&#x265D', "Bishop");
bKnight= new chessPiece('fuchsia', '&#x265E', "Knight");
bRook= new chessPiece('fuchsia', '&#x265C', "Rook");
bPawn= new chessPiece('fuchsia', '&#x265F', "Pawn");
emptySpot= new chessPiece('', '', false, [], true);


//receives a number from -6 to 6 as input then returns the corresponding piece attribute from the chessPiece class
function numToPiece(number){
    number= String(number);
    let piece = " "

    if (number=== "0"){
        piece= emptySpot;
        return piece;
    }
    if (number=== "1"){
        piece = bKing;
        return piece;
    }
    if (number=== "2"){
        piece = bQueen;
        return piece;
    }
    if (number=== "3"){
        piece = bBishop;
        return piece;
    }
    if (number=== "4"){
        piece = bKnight;
        return piece;
    }
    if (number=== "5"){
        piece = bRook;
        return piece;
    }
    if (number=== "6"){
        piece = bPawn;
        return piece;
    }
    if (number=== "-1"){
        piece = wKing;
        return piece;
    }
    if (number=== "-2"){
        piece = wQueen;
        return piece;
    }
    if (number=== "-3"){
        piece = wBishop;
        return piece;
    }
    if (number=== "-4"){
        piece = wKnight;
        return piece;
    }
    if (number=== "-5"){
        piece = wRook;
        return piece;
    }
    if (number=== "-6"){
        piece = wPawn;
        return piece;
    }
}

function id_to_int_RC(id){
    id = String(id);
    let r= id.substring(0,1);
    let c= id.substring(2,3);
    r= parseInt(r);
    c= parseInt(c);
    return [r,c]
}


//initializes the board by creating a table filled with buttons. Each button is id'd according to it's coordinate
function createGrid(row, col) {
    let chessTable = document.createElement("table");
    for (let r = 0; r < row; r++) {
        let chessRow = document.createElement("tr");
        for (let c = 0; c < col; c++) {
            let cell = document.createElement("td");
            cell.id = r + "," + c;
            cell.innerHTML = ' '
            if (isEven(r+c)){
                cell.className= 'wSquare';
            } else{
                cell.className= 'bSquare';
            }
            chessRow.appendChild(cell);
        }
        chessTable.appendChild(chessRow);
    }
    document.body.appendChild(chessTable);
}

//uses the id's of each grid button to populate the respective hmtl character found from the boardPositions into the view's board
function fillBoard(){
    update_title(gameState.playerTurn);
    let chessBoard = gameState.boardPositions;
    let r=0
    for (r= 0; r<chessBoard.length; r++) {
        let c = 0
        for (c= 0; c< chessBoard[r].length; c++){
            let identifier = r + ","+ c;
            let piece= getLocation(r,c);
            let location = document.getElementById(identifier);
            piece = numToPiece(piece);
            location.innerHTML = piece.shape;
            location.style.color= piece.color;

        }

    }
    addEvents();
    fillCaptures();
    pawnFirstMoveChecker();
    pawnExchangerChecker();

}

function addEvents() {
    let cells= document.getElementsByTagName('td');
    for (let i= 0; i<cells.length; i++){
        cells[i].onclick= function () {
            let col = this.cellIndex
            let row = this.parentNode.rowIndex;

            highlightSquare(row,col);
            return_old();
            oldLocations = []
            oldClasses= []
            retrieve_piece();

        }
    }
}

//unfinished function meant to highlight a selected square and pass the square's id to the selectedSquare function in model
function highlightSquare(row, col){
    locationTracker(row,col);
    gameState.lastSquareSelected= gameState.squareSelected;
    let oldSquare= document.getElementById(String(gameState.lastSquareSelected));
    let old_id= document.getElementById(String(gameState.lastSquareSelected)).id;

    let r= parseInt(old_id.substr(0,1), 10);
    let c= parseInt(old_id.substr(2,1), 10);
    if (isEven(r+c)){
        oldSquare.className= 'wSquare';
    } else{
        oldSquare.className= 'bSquare';
    }

    let identifier= row + ',' + col
    gameState.squareSelected= identifier

    let square= document.getElementById(identifier);
    square.className= "highlighted";
}

function locationTracker(row, col){
    let text= "You've Selected Square:<br> Row: " + row + " Column: " + col + "<br>" + numToPiece(gameState.boardPositions[row][col]).name;
    document.getElementsByClassName("tracker")[0].innerHTML= text
}

//creates a prompt that receives input on the piece the player would like to exchange a pawn for. Input must be within
//the bounds of strings: queen, rook, knight, or bishop. Otherwise prompt will loop
function exchangePrompt(player){
    let prompt_answer= prompt("Congratulations! A pawn has reached the end of the board. You may now choose any piece you would like to exchange it for:", "queen, bishop, knight, or rook")

    while (!(['queen','bishop','knight','rook'].includes(String(prompt_answer)))){
        prompt_answer= prompt("Congratulations! A pawn has reached the end of the board. You may now choose any piece you would like to exchange it for:", "queen, bishop, knight, or rook")
    }
    if (String(prompt_answer) === "queen"){
        return 2*player
    }
    if (String(prompt_answer) === "bishop"){
        return 3*player
    }
    if (String(prompt_answer) === "knight"){
        return 4*player
    }
    if (String(prompt_answer) === "rook"){
        return 5*player
    }
}

//temporary function for assignment 4 only------------------------------------------------------------------------------
function retrieve_piece(){
    current_square= id_to_int_RC(gameState.squareSelected);
    current_piece= gameState.boardPositions[current_square[0]][current_square[1]];

    if (current_piece<0){
        if(gameState.playerTurn===-1){
            if (current_piece===-6){
                pawn_move(-1, current_square[0], current_square[1])
            }
            if (current_piece===-5){
                rook_move(-1, current_square[0], current_square[1])
            }
            if (current_piece===-4){
                knight_move(-1, current_square[0], current_square[1])
            }
            if (current_piece===-3) {
                bishop_move(-1, current_square[0], current_square[1])
            }
            if (current_piece===-2) {
                queen_move(-1, current_square[0], current_square[1])
            }
            if (current_piece===-1) {
                king_move(-1, current_square[0], current_square[1])
            }
        }
        else{
            alert("Invalid Selection. This piece belongs to " + gameState.playerNames[1])
        }
    } if (current_piece>0){
        if(gameState.playerTurn===1){
            if (current_piece===6){
                pawn_move(1, current_square[0], current_square[1])
            }
            if (current_piece===5){
                rook_move(1, current_square[0], current_square[1])
            }
            if (current_piece===4){
                knight_move(1, current_square[0], current_square[1])
            }
            if (current_piece===3) {
                bishop_move(1, current_square[0], current_square[1])
            }
            if (current_piece===2) {
                queen_move(1, current_square[0], current_square[1])
            }
            if (current_piece===1) {
                king_move(1, current_square[0], current_square[1])
            }
        }
        else{
            alert("Invalid Selection. This piece belongs to " + gameState.playerNames[0])
        }
    }

    //let location = document.getElementById(gameState.squareSelected);
    //location.innerHTML = ' ';
    //console.log(coord);
    //gameState.boardPositions[coord[0]][coord[1]]= 0;
}

//currently unfinished. This redirect attempted moves to the respective piece rule functions. will move gamePieces and tie into a model function that updates the game Board
function move(row, col, player) {
    if (player === 1) {
        if ([6*player].includes(getLocation(row, col))) {
            pawnMove();
        }
        if ([5*player].includes(getLocation(row, col))) {
            rookMove();
        }
        if ([4*player].includes(getLocation(row, col))) {
            knightMove();
        }
        if ([3*player].includes(getLocation(row, col))) {
            bishopMove();
        }
        if ([2*player].includes(getLocation(row, col))) {
            queenMove();
        }
        if ([1*player].includes(getLocation(row, col))) {
            kingMove();
        } else {
            console.log("Invalid Selection")
        }
    }

}

//populates a div on either side of the board filled with current pieces in the graveyard. First it retrieves the captures Pieces nums from gameState
//then uses numToPiece() to identify the correct piece and it's shape attribute
function fillCaptures(){
    let capturesLeft= document.getElementById('capturesLeft');
    let capturesRight= document.getElementById('capturesRight');
    capturesLeft.style.color= gameState.playerColors[0];
    capturesRight.style.color= gameState.playerColors[1];


    let whiteCaptures= gameState.capturedPieces[0];
    let blackCaptures= gameState.capturedPieces[1];
    let whitePieces = []
    let blackPieces = []


    for (const element of whiteCaptures){
        let piece= numToPiece(element);
        whitePieces.push(piece.shape);
    }
    for (const element of blackCaptures){
        let piece= numToPiece(element);
        blackPieces.push(piece.shape);
    }

    capturesLeft.innerHTML = gameState.playerNames[0] + "'s Graveyard<hr>" + blackPieces;
    capturesRight.innerHTML = gameState.playerNames[1] + "'s Graveyard<hr>" + whitePieces;

}

function animationFrame(){
    let piece1= document.getElementsByClassName("animationPiece1")[0];
    let piece2= document.getElementsByClassName("animationPiece2")[0];
    let piece3= document.getElementsByClassName("animationPiece3")[0];
    let piece4= document.getElementsByClassName("animationPiece4")[0];
    let title= document.getElementById("gameTitle");
    console.log(title);
    let xPos = 0;
    let timer = setInterval(animation, 8);
    function animation() {
        if (xPos === 750){
            piece3.innerHTML = " ";
            piece4.innerHTML = " ";
            title.innerHTML= "Choose Your Names and Colors and Click the Play Button"
            clearInterval(timer);
        }else {
            if (xPos === 325){
                title.innerHTML= "Let's Play Chess!"
            }
            xPos++;
            piece1.style.fontSize = xPos + '%';
            piece2.style.fontSize = xPos + '%';
            piece1.style.left = xPos - 20 + 'px';
            piece2.style.right = xPos + 45 + 'px';

        }
    }

}

function play_button_toggle(boolian){
    if(boolian=== true){
        document.getElementById("play_button").disabled= true;
        document.getElementById("play_button").style.backgroundColor= 'gray';
    } else{
        document.getElementById("play_button").disabled= false;
        document.getElementById("play_button").style.backgroundColor= 'darkred';
    }

}

function get_P1_info(){
    let text= "you've selected '" + document.getElementById("p1_name").value + "' as player 1's name and '" + document.getElementById("p1_color").value + "' as player 1's color. Is this correct?"
    let answer= confirm(text);
    if (answer === true) {
        gameState.inputReceived[0] = true;
        document.getElementById('submit_name_1').disabled = true;
        document.getElementById('submit_name_1').style.backgroundColor = 'gray';


        gameState.playerNames[0] = document.getElementById("p1_name").value;
        gameState.playerColors[0] = document.getElementById("p1_color").value;

        bKing.color = gameState.playerColors[0]
        bQueen.color = gameState.playerColors[0]
        bBishop.color = gameState.playerColors[0]
        bKnight.color = gameState.playerColors[0]
        bRook.color = gameState.playerColors[0]
        bPawn.color = gameState.playerColors[0]

        if (gameState.inputReceived[1] === true) {
            play_button_toggle(false)
        }
    }
}

function get_P2_info(){
    let text= "you've selected '" + document.getElementById("p2_name").value + "' as player 2's name and '" + document.getElementById("p2_color").value + "' as player 2's color. Is this correct?"
    let answer= confirm(text);
    if (answer === true) {
        gameState.inputReceived[1] = true;
        document.getElementById('submit_name_2').disabled = true;
        document.getElementById('submit_name_2').style.backgroundColor = 'gray';

        gameState.playerNames[1] = document.getElementById("p2_name").value;
        gameState.playerColors[1] = document.getElementById("p2_color").value;

        wKing.color = gameState.playerColors[1]
        wQueen.color = gameState.playerColors[1]
        wBishop.color = gameState.playerColors[1]
        wKnight.color = gameState.playerColors[1]
        wRook.color = gameState.playerColors[1]
        wPawn.color = gameState.playerColors[1]

        if (gameState.inputReceived[0] === true) {
            play_button_toggle(false)
        }
    }
}

function update_title(player){
    let text= "";
    let title= document.getElementById("gameTitle");


    if (player===1){
        title.style.color= gameState.playerColors[0]
        text = gameState.playerNames[0] + "'s Turn"
    }
    if (player===-1){
        title.style.color= gameState.playerColors[1]
        text = gameState.playerNames[1] + "'s Turn"
    }
    title.innerHTML= String(text);
}

function changeTurn(current_player){
    if(current_player===1){
        gameState.playerTurn= -1
    }
    if(current_player===-1){
        gameState.playerTurn= 1
    }
    update_title(gameState.playerTurn);
}

function is_blocked(player,row,col){
    if (player===-1){
        return gameState.boardPositions[row][col] !== 0;
    }
    if (player===1) {
        return gameState.boardPositions[row][col] !== 0;
    }
}

function is_killable(player, row, col){
    if (player===-1){
        return gameState.boardPositions[row][col] > 0;
    }
    if (player===1){
        return gameState.boardPositions[row][col] < 0;
    }
}

function potential_move(player,row,col){
    let square= document.getElementById(row + "," + col);
    oldLocations.push(square);
    oldClasses.push(square.className);
    square.className= "potential"
    square.setAttribute( "onClick", "move_piece("+player+ ","+row+ ","+col+");")
}

function potential_kill(player,row,col){
    let square= document.getElementById(row + "," + col);
    oldLocations.push(square);
    oldClasses.push(square.className);
    square.className= "kill"
    square.setAttribute( "onClick", "capture_piece("+player+ ","+row+ ","+col+");")
}

function capture_piece(player,row,col){
    let answer= confirm("Confirm move to row: " + row + ", Column: " +col)

    if(answer===true){
        let attacker= numToPiece(current_piece);
        let victim= numToPiece(gameState.boardPositions[row][col])
        let captive= "";
        let captor= "";

        if(player===1){
            captor = gameState.playerNames[0];
            captive = gameState.playerNames[1];
            gameState.capturedPieces[0].push(gameState.boardPositions[row][col])
        }else {
            captor = gameState.playerNames[1];
            captive = gameState.playerNames[0];
            gameState.capturedPieces[1].push(gameState.boardPositions[row][col])
        }


        alert(captor + "'s " + attacker.name+  " has captured " + captive + "'s " + victim.name)

        gameState.boardPositions[row][col]= current_piece;
        gameState.boardPositions[current_square[0]][current_square[1]]= 0;
        return_old()
        fillBoard();
    }
}

function move_piece(player,row,col){
    let answer= confirm("Confirm move to row: " + row + ", Column: " +col)

    if(answer===true){

        gameState.boardPositions[row][col]= current_piece;
        gameState.boardPositions[current_square[0]][current_square[1]]= 0;
        return_old()
        fillBoard();
    }

}

function return_old(){
    if(oldLocations.length<1){
        return
    }
    for (i = 0; i < oldLocations.length; i++){
        let current= oldLocations[i];
        let current_class= oldClasses[i];
        current.className= current_class;
    }
}

function pawn_move(player,row,col){
    if (player===1){
        if (is_blocked(player,row - 1, col)===false){
            potential_move(player,row - 1, col)
            if(row===6){
                if (is_blocked(player,row - 2, col)===false){
                    potential_move(player,row - 2, col)

                }
            }
        }if(is_killable(player,row-1,col+1)===true){
            potential_kill(player,row-1,col+1)
        }
        if(is_killable(player,row-1,col-1)===true){
            potential_kill(player,row-1,col-1)
        }
    }
    if (player===-1){
        if (is_blocked(player,row + 1, col)===false){
            potential_move(player,row + 1, col)
            if(row===1){
                if (is_blocked(player,row + 2, col)===false){
                    potential_move(player,row + 2, col)
                }
            }
        }if(is_killable(player,row+1,col+1)===true){
            potential_kill(player,row+1,col+1)
        }
        if(is_killable(player,row+1,col-1)===true){
            potential_kill(player,row+1,col-1)
        }
    }
}

function rook_move(player,row,col) {
    let downMoves= 7-row;
    let upMoves= row;
    let leftMoves= col;
    let rightMoves= 7-col;

    for(i=1; i<=downMoves; i++){
        if(is_blocked(player,row+i,col)===true){
            if(is_killable(player,row+i,col)===true) {
                potential_kill(player, row + i, col);
            }
            break;
        }else{
            potential_move(player,row + i, col)
        }
    }
    for(i=1; i<=upMoves; i++){
        if(is_blocked(player,row-i,col)===true){
            if(is_killable(player,row-i,col)===true) {
                potential_kill(player, row - i, col);
            }
            break;
        }else{
            potential_move(player,row - i, col)
        }
    }
    for(i=1; i<=leftMoves; i++){
        if(is_blocked(player,row,col-i)===true){
            if(is_killable(player,row,col-i)===true) {
                potential_kill(player,row,col-i);
            }
            break;
        }else{
            potential_move(player,row, col-i)
        }
    }
    for(i=1; i<=rightMoves; i++){
        if(is_blocked(player,row,col+i)===true){
            if(is_killable(player,row,col+i)===true) {
                potential_kill(player,row,col+i);
            }
            break;
        }else{
            potential_move(player,row, col+i)
        }
    }
}

function bishop_move(player,row,col) {
    let SEMoves;
    let SWMoves;
    let NEMoves;
    let NWMoves;

    function stepsSE(row,col){
        if(row>col){
            return 7-row;
        }
        else{
            return 7-col
        }
    }

    function stepsNE(row,col){
        return stepsSE(col, 7-row)
    }

    function stepsNW(row,col){
        return stepsNE(col, 7-row)
    }

    function stepsSW(row,col){
        return stepsNW(col, 7-row)
    }

    SEMoves= stepsSE(row,col);
    NEMoves= stepsNE(row,col);
    NWMoves= stepsNW(row,col);
    SWMoves= stepsSW(row,col);

    for(i=1; i<=NEMoves; i++){
        console.log(i, NEMoves)
        if(is_blocked(player,row-i,col+i)===true){
            if(is_killable(player,row-i,col+i)===true) {
                potential_kill(player,row-i,col+i);
            }
            break;
        }else{
            potential_move(player,row-i,col+i)
        }
    }
    for(i=1; i<=NWMoves; i++){
        if(is_blocked(player,row-i,col-i)===true){
            if(is_killable(player,row-i,col-i)===true) {
                potential_kill(player,row-i,col-i);
            }
            break;
        }else{
            potential_move(player,row-i,col-i)
        }
    }
    for(i=1; i<=SEMoves; i++){
        if(is_blocked(player,row+i,col+i)===true){
            if(is_killable(player,row+i,col+i)===true) {
                potential_kill(player,row+i,col+i);
            }
            break;
        }else{
            potential_move(player,row+i,col+i)
        }
    }
    for(i=1; i<=SWMoves; i++){
        if(is_blocked(player,row+i,col-i)===true){
            if(is_killable(player,row+i,col-i)===true) {
                potential_kill(player,row+i,col-i);
            }
            break;
        }else{
            potential_move(player,row+i,col-i)
        }
    }
}

function knight_move(player,row,col){
    let directions = [[row + 1,col + 2],[row + 1,col - 2],[row - 1,col + 2],[row - 1,col - 2],[row + 2,col + 1],[row + 2,col - 1],[row - 2,col + 1],[row - 2,col - 1]]

    for(i=0; i<directions.length; i++){
        let r = directions[i][0]
        let c = directions[i][1]

        if(r<0 || c<0 || r>7 || c>7){
            continue;
        }

        else{
            if(is_blocked(player,r,c)===true){
                if(is_killable(player,r,c)===true) {
                    potential_kill(player,r,c);
                }
                continue;
            }else {
                potential_move(player, r, c)
            }
        }
    }
}

function queen_move(player,row,col){
    bishop_move(player,row,col)
    rook_move(player,row,col)
}

function king_move(player,row,col){
    let direction= [[row - 1, col], [row - 1, col + 1],[row, col + 1],[row + 1, col + 1],[row + 1, col],[row + 1, col -1],[row, col -1],[row - 1, col - 1]]

    for(i=0; i<direction.length; i++){
        let r = direction[i][0]
        let c= direction[i][1]

        if(r<0 || c<0 || r>7 || c>7){
            continue;
        }

        else{
            if(is_blocked(player,r,c)===true){
                if(is_killable(player,r,c)===true) {
                    potential_kill(player,r,c);
                }
                continue;
            }else {
                potential_move(player, r, c)
            }
        }
    }
}

function update_player_customs(){
    document.getElementById('submit_name_2').disabled = true;
    document.getElementById('submit_name_2').style.backgroundColor = 'gray'

    document.getElementById('submit_name_1').disabled = true;
    document.getElementById('submit_name_1').style.backgroundColor = 'gray';

    wKing.color = gameState.playerColors[1]
    wQueen.color = gameState.playerColors[1]
    wBishop.color = gameState.playerColors[1]
    wKnight.color = gameState.playerColors[1]
    wRook.color = gameState.playerColors[1]
    wPawn.color = gameState.playerColors[1]

    bKing.color = gameState.playerColors[0]
    bQueen.color = gameState.playerColors[0]
    bBishop.color = gameState.playerColors[0]
    bKnight.color = gameState.playerColors[0]
    bRook.color = gameState.playerColors[0]
    bPawn.color = gameState.playerColors[0]

    play_button_toggle(true)

}
document.getElementById("save_button").style.disable=true;
onload= play_button_toggle(true)
onload = createGrid(8,8);
onload= animationFrame();
onload= display_storage();

