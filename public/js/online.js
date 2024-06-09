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

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split("-").pop();

    if (nextTurn != playerID) {
        alert("not your turn");
        return;
    }

    if (el.textContent) {
        alert("invalid move");
        return;
    }

    updateGridSquare(id, playerID, fadeIn=true, fadeOut=false, color=1);

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
            gameboardGrids[i].style.color = "black"
        }
        else {
            gameboardGrids[i].textContent = "";
        }
    }

    winner = checkWinner(gameArr);
    if (winner) {
        updateTurnLabel(nextTurn, winner.id)

        for (grid of winner.combo) {
            gameboardGrids[grid].style.backgroundColor = "green";
        }

        return;
    }

    if (warningMove) {
        gameboardGrids[warningMove.id].style.color = "red";
    }

    console.log("cont")
    updateTurnLabel(nextTurn);

    addGridEventListeners(true)
}


// Invite button
const currentUrl = window.location.href;
const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, '');

const msg = `let's play three-piece tic-tac-toe together!\non ${urlWithoutProtocol}\n\nmade by Shalin.`;

const inviteBtnEl = document.getElementById("invite-btn");
inviteBtnEl.addEventListener("click", inviteBtnFunction)

function inviteBtnFunction() {
    navigator.clipboard.writeText(msg)
        .then(() => {
            createNotification("Invite link copied to clipboard");
        })
}