console.log("online.js");

const parts = window.location.pathname.split("/");
const gameCode = parts[parts.length - 1];

let oldSessionID = localStorage.getItem(gameCode);
let playerID; let nextTurn; let moves; let gameArr; let warningMove; let turnCount;

socket = io()

socket.on("connectionResponse", (data) => {
    const sessionID = data.sessionID;

    console.log(sessionID);
})

if (!oldSessionID) {
    socket.emit("gameConnect", {
    "gameCode": gameCode
    }
)}
else {
    socket.emit("gameReconnect", {
        "gameCode": gameCode,
        "oldSessionID": oldSessionID
    })
}

socket.on("gameConnectResponse", (data) => {
    if (data.status === "failure") {
        alert(data.failureReason);
        window.location.href = "/";
        return;
    }

    localStorage.setItem(gameCode, data.userData.sessionID);

    playerID = data.userData.playerID;
    console.log(`you are ${playerID}`);

    game = data.game;

    setupGrid(game);
})

socket.on("playMoveResponse", (data) => {
    console.log("playMoveResponse");

    game = data.game;

    setupGrid(game);
})

const gameboardGrids = Array.from(document.querySelectorAll(".gameboard-grid"));

function addGridEventListeners(action) {
    if (action) {
        for (grid of gameboardGrids) {
            grid.addEventListener("click", gridFunction);
        }
        return;
    }

    else{
        for (grid of gameboardGrids) {
            grid.removeEventListener("click", gridFunction);
        }
        return;
    }
}

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split("-").pop();

    if (el.textContent) {
        alert("invalid move");
        return;
    }

    if (nextTurn != playerID) {
        alert("not your turn");
        return;
    }

    el.textContent = playerID;

    socket.emit("playMove", {
        "gameCode": gameCode,
        "move": {"id": id, "playerID": playerID}
    })

    addGridEventListeners(false);
}

function setupGrid(game) {
    gameArr = game.gameArray;
    moves = game.moves;

    nextTurn = findNextTurn(moves);

    updateTurnCount(moves.length)
    
    if (moves.length >= 6) {
        lastMoves = moves.slice(-6);
        warningMove = lastMoves[0];
    }
    else {
        lastMoves = moves;
        warningMove;
    }

    for (let i=0; i<9; i++) {
        symbol = gameArr[i];

        if (symbol != "") {
            gameboardGrids[i].textContent = symbol;
        }
        else {
            gameboardGrids[i].textContent = "";
        }
    }

    if (warningMove) {
        gameboardGrids[warningMove.id].style.color = "red";
    }

    winner = checkWinner(gameArr);
    if (winner) {
        updateTurnLabel(nextTurn, winner=winner.id)

        console.log(winner.grids)

        return;
    }
    console.log("cont")
    updateTurnLabel(nextTurn);

    addGridEventListeners(true)
}

function findNextTurn(moves) {
    movesNum = moves.length;

    if (movesNum % 2 === 0) {
        return "X"
    }
    else {
        return "O"
    }
}

function checkWinner(board) {
    // Define all possible winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Iterate through each winning combination
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        // Check if the elements at the indexes in the combination are equal and not empty
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            // If they are equal, we have a winner
            return {"id": board[a], 
            "grids": [a,b,c]};
        }
    }

    // If no winner is found after checking all combinations, return null
    return null;
}

const turnTextEl = document.getElementById("turn-label");
const turnLabelEl = document.getElementById("turn-label-symbol");
const turnCountEl = document.getElementById("turn-count-number");

function updateTurnCount(turnCount) {
    turnCountEl.textContent = turnCount;
}

function updateTurnLabel(nextTurn, winner=null) {
    if (winner) {
        turnTextEl.textContent = `${winner} wins !!` 
        return
    }
    turnLabelEl.textContent = nextTurn;
}
