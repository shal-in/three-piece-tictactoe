console.log("online.js");

const parts = window.location.pathname.split("/");
const gameCode = parts[parts.length - 1];

let oldSessionID = localStorage.getItem(gameCode);
let playerID; let currentTurn; let moves; let gameArr; let warningMove; let turnCount;

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

    setupGrid(game, mode="online", initial=true);
})

socket.on("playMoveResponse", (data) => {
    game = data.game;

    setupGrid(game, mode="online", initial=false);
})

const gameboardGrids = Array.from(document.querySelectorAll(".gameboard-grid"));

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split("-").pop();

    if (currentTurn != playerID) {
        alert("not your turn");
        return;
    }

    if (checkGridTaken(id)) {
        alert("invalid move");
        return;
    }

    updateGridSquare(id, playerID, fadeIn=true, fadeOut=false, color=1);

    socket.emit("playMove", {
        "gameCode": gameCode,
        "move": {"id": id, "symbol": playerID}
    })

    addGridEventListeners(false);
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