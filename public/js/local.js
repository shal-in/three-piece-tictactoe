console.log("local.js");

// Select all elements with class "gameboard-grid" and convert them into an array
const gameboardGrids = Array.from(document.querySelectorAll(".gameboard-grid"));
gameboardGrids.forEach(grid => grid.addEventListener("click", gridFunction));

let gameArr = ["", "", "", "", "", "", "", "", ""];
let currentTurn = "X"; let winner;
let moves = []; let move; let removeMove; let warningMove;
let turnCount = 0;

function gridFunction(event) {
    const el = event.target;
    const id = el.id.split("-").pop();

    // check winner

    if (checkGridTaken(id)) {
        alert ("invalid move");
        return
    }

    gameArr[id] = currentTurn;
    move = {"id": id, "symbol": currentTurn};
    moves.push(move);

    updateGridSquare(id, currentTurn, fadeIn=true, fadeOut=false, color=1)

    currentTurn = changeTurn();
    setupGrid();
}



function setupGrid() {
    winner = checkWinner(gameArr); // [symbol, [combination]]
    if (moves.length >= 6) {
        if (moves.length > 6) {
            removeMove = moves[0]; // {id, symbol}
            gameArr[removeMove.id] = "";
            moves.shift();

            updateGridSquare(removeMove.id, removeMove.symbol, fadeIn=false, fadeOut=true);
        }

        if (!winner) {
            warningMove = moves[0];
            updateWarningMove(warningMove.id, warningMove.symbol);
        }
    }

    if (winner) {
        for (id of winner[1]) {
            gameboardGrids[id].style.backgroundColor = "black";
        }

        gameboardGrids.forEach(grid => grid.removeEventListener("click", gridFunction));

        console.log(`${winner[0]} wins!!`);
        return;
    }
 
    updateTurnCount(turnCount += 1);
    updateTurnLabelSymbol(currentTurn);
}



function changeTurn() {
    let nextTurn;
    if (currentTurn === "X") {
        nextTurn = "O"
    } else {
        nextTurn = "X"
    }
    return nextTurn;
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
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            // If they are equal, we have a winner
            return [board[a], combination]; // Return the winning symbol ("X" or "O")
        }
    }

    // If no winner is found after checking all combinations, return null
    return null;
}

// Turn label and turn count
const turnLabelSymbolEl = document.getElementById("turn-label-symbol");
const XLabelSymbolEl = document.getElementById("X-symbol-svg");
const OLabelSymbolEl = document.getElementById("O-symbol-svg");
function updateTurnLabelSymbol(turnLabel) {
    if (turnLabel === "X") {
        OLabelSymbolEl.classList.add("fade-out-350");
        setTimeout(()=> {
            OLabelSymbolEl.style.display = "none";
            XLabelSymbolEl.classList.add("fade-in-350");
            XLabelSymbolEl.style.display = "inline";
            OLabelSymbolEl.classList.remove("fade-out-350");
        }, 348)
    }

    if (turnLabel === "O") {
        XLabelSymbolEl.classList.add("fade-out-350");
        setTimeout(()=> {
            XLabelSymbolEl.style.display = "none";
            OLabelSymbolEl.classList.add("fade-in-350");
            OLabelSymbolEl.style.display = "inline";
            XLabelSymbolEl.classList.remove("fade-out-350");
        }, 348);
    }
}

const turnCountEl = document.getElementById("turn-count-number")
function updateTurnCount(turnCount) {
    turnCountEl.classList.add("fade-out-350");
    turnCountEl.classList.remove("fade-in-350")
    setTimeout(() => {
        turnCountEl.textContent = turnCount;
        turnCountEl.classList.add("fade-in-350");
        turnCountEl.classList.remove("fade-out-350");
    }, 348)
}

// Update grid square function
function updateGridSquare(id, symbol, fadeIn=false, fadeOut=false, color=1) {
    let svgs = gameboardGrids[id].getElementsByTagName("svg");
    let svg;

    if (symbol === "X") {
        svg = svgs[0]
    }
    else if (symbol === "O") {
        svg = svgs[1]
    }

    if (fadeIn) {
        svg.style.stroke = `var(--${symbol}${color}-main)`;
        svg.classList.remove("fade-out-350");
        svg.classList.add("fade-in-350");
        setTimeout(() => {
            svg.style.display = "inline"
        }, 348);
    } else if (fadeOut) {
        svg.classList.remove("fade-in-350");
        svg.classList.add("fade-out-350");
        setTimeout(() => {
            svg.style.display = "none"
        }, 348);
    }
}

// Update warning move
function updateWarningMove(id, symbol) {
    updateGridSquare(id, symbol, fadeIn=false, fadeOut=true, color=1);

    setTimeout(() => {
        updateGridSquare(id, symbol, fadeIn=true, fadeOut=false, color=2);
    }, 348)
}

// Check if grid is taken
function checkGridTaken(id) {
    let svgs = gameboardGrids[id].getElementsByTagName("svg");

    for (let svg of svgs) {
        if (window.getComputedStyle(svg).display !== "none") {
            return true
        }
    }
    return false
}