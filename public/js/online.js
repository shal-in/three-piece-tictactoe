const parts = window.location.pathname.split("/");
const gameCode = parts[parts.length - 1];

let oldSessionID = localStorage.getItem(gameCode);
let playerID; let currentTurn;

socket = io();

if (!oldSessionID) {
    socket.emit("gameConnect", {
        "gameCode": gameCode,
    });
}
else {
    socket.emit("gameReconnect", {
        "gameCode": gameCode,
        "oldSessionID": oldSessionID
    })
}

socket.on("connectionResponse", (data) => {
    const sessionID = data.sessionID;
    console.log(sessionID);

    localStorage.setItem(gameCode, sessionID);
});

socket.on("gameConnectResponse", (data) => {
    if (data.status === "failure") {
        alert(data.message);
        window.location.href= "/"
    }
    game = data.game;

    playerID = data.userData.playerID;
    currentTurn = data.game.currentTurn;

    setupGrid(game, first=true);
});

socket.on("gameMoveResponse", (data) => {
    game = data.game;

    setupGrid(game);
})


// Select all elements with class "gameboard-grid" and convert them into an array
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
    const id = el.id.split("-").pop()

    if (currentTurn !== playerID) {
        alert("Not your turn")
        return;
    }

    if (el.innerHTML != "") {
        alert("Invalid move");
        return;
    }

    el.innerHTML = getSVG(playerID, "primary");

    socket.emit("gameMove", {
        "gameCode": gameCode,
        "move": {
            "id": id,
            "playerID": playerID
        }
    })

    addGridEventListeners(false)
}

function setupGrid(game, first=false) {
    state = game.gameState;
    gameArr = game.gameArray;
    moves = game.lastMoves;
    currentTurn = game.currentTurn;

    for (let i=0; i<9; i++) {
        symbol = gameArr[i];

        if (symbol != "") {
            gameboardGrids[i].innerHTML = getSVG(symbol, "primary");
        }
        else {
            gameboardGrids[i].innerHTML = "";
        }

        if (moves.length == 6) {
            let removeMove = moves[0];

            gameboardGrids[removeMove.id].innerHTML = getSVG(removeMove.playerID, "secondary");
        }
    }

    if (state === "finished") {
        winner = game.winner;
        winnerID = winner.id;
        winnerGrids = winner.grids;

        console.log(winnerID + " wins!")

        for (grid of winnerGrids) {
            gameboardGrids[grid].style.backgroundColor = "red";
        }
        addGridEventListeners(false);
        return;
    }

    addGridEventListeners(true);
}








function getSVG(symbol, num) {
    if (num === "primary") {
        num = 1
    }
    else {
        num = 2
    }

    if (symbol === "X") {
        // Return X SVG
        return `<svg class="move-svg X-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 5L5 19M5 5L9.5 9.5M12 12L19 19" stroke="var(--${symbol}-col-${num}-main)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }

    else {
        // Return O SVG
        return `<svg class="move-svg O-svg"viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="var(--${symbol}-col-${num}-main" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`
    }
}