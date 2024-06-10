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
        createNotification("not your turn");
        return;
    }

    if (checkGridTaken(id)) {
        createNotification("invalid move");
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

const inviteBtnEl = document.getElementById("invite-btn");
inviteBtnEl.addEventListener("click", inviteBtnFunction)


function inviteBtnFunction() {
    const msg = `let's play three-piece tic-tac-toe together!\non ${urlWithoutProtocol}\n\nmade by Shalin.`;
    copyToClipboard(msg).then(() => {
        createNotification("Invite link copied to clipboard");
    }).catch(err => {
        createNotification("Failed to copy invite link to clipboard");
        console.error('Failed to copy text to clipboard', err);
    });
}

function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (!navigator.clipboard) {
            // Clipboard API not available, use fallback method
            fallbackCopyTextToClipboard(text)
                .then(resolve)
                .catch(reject);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            resolve();
        }).catch(err => {
            console.error('Failed to copy text using Clipboard API, using fallback method. Error:', err);
            fallbackCopyTextToClipboard(text)
                .then(resolve)
                .catch(reject);
        });
    });
}

function fallbackCopyTextToClipboard(text) {
    return new Promise((resolve, reject) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.position = "fixed";
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
            document.body.removeChild(textArea);
            if (successful) {
                resolve();
            } else {
                reject(new Error('Fallback: Copy command was unsuccessful'));
            }
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
            document.body.removeChild(textArea);
            reject(err);
        }
    });
}
