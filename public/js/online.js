console.log("online.js")

const parts = window.location.pathname.split("/");
const gameCode = parts[parts.length - 1];

let oldSessionID = localStorage.getItem(gameCode);

socket = io();

socket.on("connectionResponse", (data) => {
    const sessionID = data.sessionID;
    console.log(sessionID);
    console.log(data.gameCode)

    localStorage.setItem(gameCode, sessionID);
})

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