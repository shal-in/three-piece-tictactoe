console.log("local.js");

// Select all elements with class "gameboard-grid" and convert them into an array
const gameboardGrids = Array.from(document.querySelectorAll(".gameboard-grid"));
addGridEventListeners(true);

const game = {
    "gameArray": ["", "", "", "", "", "", "", "", ""],
    "moves": []
}

let currentTurn = "X";ß

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split("-").pop();

    if (checkGridTaken(id)) {
        createNotification("Invalid move");
        return;
    }

    addGridEventListeners(false);
    updateGridSquare(id, currentTurn, fadeIn=true, fadeOut=false, color=1)

    game.gameArray[id] = currentTurn;
    game.moves.push({"id": id, "symbol": currentTurn});

    setupGrid(game, "local");
}


