
<<<<to test the JSON file. try and change the board positions, graveyard, player names, or player colors>>>


Location
-----------------
My loaded JSON file is located in game_save.json.

the function that loads this data is located in chess.js on lines 22-43

Summary
-----------------
The goal of my JSON file is to provide the foundations for a potential game save option. The file would provide every
piece of information required to pick right up where you left off from player customizations to the state of the entire
board. It would also contain a date property that could the player the exact time and date of the game they are continuing


Content
-----------------
The JSON file consists of  4 major parts:

general info includes:
    the game name
    the game version
    the current save date

player customizations listed under "playerInfo" that includes:
    playerNames: the names that the players chose. Updating this will update the names in the graveyard
    playerColors: the color the players chose for their pieces. Updating this will change piece color

the current state of the game under "gameState" includes:
    "boardPositions": updating this will change the positions of each position on the board. pieces are( 1-king,2-queen,
    3-bishop,4-knight,5-rook,6-pawn). adding a '-' before the number will change from player 1 to player 2
    "capturedPieces": updating this will change which pieces are currently captured
    "playerTurn": updating this will change whose turn it currently is

    the rest of these have not been implemented yet, so updating is only their planned effect
    ------------------------------------------------------------------------------------
    "checkmate": updating this will end the game in favor of whose turn it currently is
    "check": updating this will put the next player in or out of check
    "castle": updating this will create a castle scenario
    "pawnExchange": updating this will allow the player to exchange a piece for any other
    "pawnFirstMove": updating this will change which pieces have the option to move twice for their first move.

the cursor section includes:
    the most recent square selected. this square will be highlighted
    the last square selected. this square will return to it's original css
    the piece that the current square selected has
