let board = [[0,0,0],[0,0,0],[0,0,0]]
let playerTurn = 0;
let result;
let player = null;
let gameResult;
let roundCount = 1;

const move = (tile,coordinates) => {
    
    if (player){
        let element = document.querySelector(`div#${tile}`);
        let x = coordinates[0]
        let y = coordinates[1]
        
        if (playerTurn % 2 == 0 && element.innerText == "-" ){
            element.textContent = "X";
            playerTurn++;
            board[x][y] = 1;
            let result = checkBoard(board,1);

            if(result){
                if(player != "X"){
                    gameResult = "lose";
                    getResults();
                    roundCount++;
                }
            }
            else if(playerTurn == 9){
                gameResult = "draw";
                getResults();
                roundCount++; 
            }
            if(playerTurn < 9 && player == "X"){
                let moves = minValue(board,playerTurn,0)
                let move = movePicker(moves,"MAX");
                opponentMove(move)
            }


        }else if(element.innerText == "-"){
            element.textContent = "O";
            playerTurn++;
            board[x][y] = -1;
            let result = checkBoard(board,-1);

            if(result){
                console.log("O Win!")
                if(player != "O"){
                    gameResult = "lose";
                    getResults();
                    roundCount++;
                }
            }
            else if(playerTurn == 9){
                gameResult = "draw"
                getResults();
                roundCount++;
            }
            if(playerTurn < 9 && player == "O"){
                let moves = minValue(board,playerTurn,0)
                let move = movePicker(moves,"MAX");
                opponentMove(move)
            }
        }
     
        if(roundCount == 6){
            giveClue();
        }

    }else{
        alert("Select your player first!");

    }
   
}


const opponentMove = (info) =>{
   
    const x = info[2][0];
    const y = info[2][1];
    const tile = 'tile' + x.toString() + '-' + y.toString();
    move(tile,[x,y]);
    
}


const getResults = () => {
    
    fetch('/tictactoe',{
        method: "POST",
	        headers: { "Content-Type": "application/json" },
	        body: JSON.stringify({result : gameResult})
		})
        .then(res => res)
        .then(data=>data.text()
                .then(d=>
                    {alert(JSON.parse(d)["msg"])}
            )
        );
}

const giveClue = () => {
    let element = document.querySelector('div#secretPath');
    element.innerText = "Well I guess you can't defeat me.\n Thank you for playing, here's your prize: \n /secretPath";
}

const resetBoard = () => {
    let i;
    let j;
    for(i = 0; i < board.length; i++){
        for (j = 0; j < board[i].length; j++){
            board[i][j] = 0;
        }
    }
    playerTurn = 0;
    player = null;
    let element = document.querySelectorAll(`div.tile`);
    element.forEach((e) => {
        e.textContent = '-'
    });
    let buttonX = document.getElementById("buttonX");
    let buttonO = document.getElementById("buttonO");
    buttonX.disabled = false;
    buttonO.disabled = false;
}

const movePicker = (moves,mode) => {
    
    let move = moves[0];
    if (mode == "MAX"){
        let i;
        for ( i = 1; i < moves.length; i++){
            if (moves[i][0] > move[0]){
                move = moves[i];
            }else if(moves[i][0] == move[0] && moves[i][1] < move[1]){
                move = moves[i];
            }
        }
    }else{
        for ( i = 0; i < moves.length; i++){
            if(moves[i][0] <= move[0] && moves[i][1] <= move[1]){
                move = moves[i];
            }
        }
    }
    
    return move;
}

const choosePlayer = (choice) => {
    player = choice;
    let element = document.querySelector('p#player');
    if (choice == "X"){
        element.textContent = "Playing as X"
    }else{
        element.textContent = "Playing as O"
        let moves = minValue(board,playerTurn,0);
        let move = movePicker(moves,"MAX");
        opponentMove(move)
    }
    let buttonX = document.getElementById("buttonX");
    let buttonO = document.getElementById("buttonO");
    buttonX.disabled = true;
    buttonO.disabled = true;
    
    let round = document.querySelector('div#round');
    round.textContent = `Round: ${roundCount}`;
}

const checkBoard = (boardCopy,symbol) => {
    // Row check
    for (let i = 0; i < 3; i++){
        if (boardCopy[i][0] === symbol && boardCopy[i][1] === symbol && boardCopy[i][2] === symbol){
            return true;
        }
    }

    // Column check
    for(let j = 0; j < 3; j++){
        if(boardCopy[0][j] === symbol && boardCopy[1][j] === symbol && boardCopy[2][j] === symbol){
            return true;
        }
    }

    // Diagonal check
    if (boardCopy[0][0] === symbol && boardCopy[1][1] === symbol && boardCopy[2][2] === symbol){
        return true;
    }
    if (boardCopy[0][2] === symbol && boardCopy[1][1] === symbol && boardCopy[2][0] === symbol){
        return true;
    }

    return false;
}




const shuffle = (freeCells) => {
    for (let i = freeCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [freeCells[i], freeCells[j]] = [freeCells[j], freeCells[i]];
      }
    return freeCells;
}






const maxValue = (boardCopy,turnCount,depth) => {

    let turn;
    let win;
    if (turnCount % 2 == 0 ){
        turn = 1;
        win = 1;
    }else{
        turn = -1;
        win = -1;
    }

    let boardDeepCopy = boardCopy.map((row) => row.slice());

    let freeCells = []
    for (let i = 0; i < boardDeepCopy.length; i++){
        for(let j = 0; j < boardDeepCopy[0].length; j++){
            if (boardDeepCopy[i][j] == 0){
                freeCells.push([i,j]);
            }
        }
    }

    
    let results = [];

    if (freeCells.length > 0){
        let i;
        for (i = 0; i < freeCells.length; i++){
            let x = freeCells[i][0];
            let y = freeCells[i][1];

            boardDeepCopy[x][y] = turn;
            let isGameOver = checkBoard(boardDeepCopy,win);

            if(isGameOver){
                results.push([1,depth,[x,y]]);
            }else{
                if (freeCells.length == 1){
                    results.push([0,depth,[x,y]]);
                }else{
                    let child = minValue(boardDeepCopy,turnCount+1,depth+1);
                    results.push(child);
                    boardDeepCopy[x][y] = 0;
                }
            }
        }
    }
    

    if (turnCount == playerTurn){
        return results;
    }

    let leaf = results[0];
    let i;
    for (i = 1; i < results.length; i ++){
        if (results[i][0] > leaf[0]){
            leaf = results[i]
        }else if(results[i][0] == leaf[0] && results[i][1] < leaf[1]){
            leaf = results[i]
        }
    }
    return leaf;



}

const minValue = (boardCopy,turnCount,depth) => {
    let turn;
    let win;
    if (turnCount % 2 == 0 ){
        turn = 1;
        win = 1;
    }else{
        turn = -1;
        win = -1;
    }

    let boardDeepCopy = boardCopy.map((row) => row.slice());

    let freeCells = [];
    for (let i = 0; i < boardDeepCopy.length; i++){
        for(let j = 0; j < boardDeepCopy[0].length; j++){
            if (boardDeepCopy[i][j] == 0){
                freeCells.push([i,j]);
            }
        }
    }

  
    let results = [];
    
    

    if (freeCells.length > 0){
        let i;
        for (i = 0; i < freeCells.length; i++){
            let x = freeCells[i][0];
            let y = freeCells[i][1];

            boardDeepCopy[x][y] = turn;
            
            let isGameOver = checkBoard(boardDeepCopy,win);
            
            if(isGameOver){
                results.push([-1,depth,[x,y]]);
            }else{
                if (freeCells.length == 1){
                    results.push([0,depth,[x,y]]);
                }else{
                    let child = maxValue(boardDeepCopy,turnCount+1,depth+1);
                    results.push(child);
                    boardDeepCopy[x][y] = 0;
                }
            }
        }
    }

    

    if (turnCount == playerTurn){
        return results;
    }
    

    let leaf = results[0];
    let i;
    for (i = 1; i < results.length; i ++){
        if (results[i][0] < leaf[0]){
            leaf = results[i]
        }else if(results[i][0] == leaf[0] && results[i][1] < leaf[1]){
            leaf = results[i]
        }
    }
    return leaf;
}