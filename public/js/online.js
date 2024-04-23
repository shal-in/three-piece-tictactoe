console.log("online.js")

const parts = window.location.pathname.split("/");
const gameCode = parts[parts.length - 1];

let oldSessionID = localStorage.getItem(gameCode);
let playerID;

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
    playerID = data.playerID;
    console.log(`CONNECT: you are ${playerID}`)
});

socket.on("gameReconnectResponse", (data) => {
    playerID = data.playerID;
    console.log(`RECONNECT: you are ${playerID}`)
})