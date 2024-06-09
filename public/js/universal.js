if (window.location.pathname !== "/") {
    window.addEventListener('beforeunload', function (e) {
        // Prevent the default unload behavior to show the standard dialog
        e.preventDefault();
        e.returnValue = ''; // Some browsers require returnValue to be set
    });
}

// Rules
const ruleBtnEl = document.getElementById("rules-btn");

function rulesBtnFunction() {
    createNotification("Rules functionality coming soon");
}

ruleBtnEl.addEventListener("click", rulesBtnFunction)

const leftArrowEl = document.getElementById("rules-left");
const rightArrowEl = document.getElementById("rules-right");

let i=0;
if (leftArrowEl) {
    leftArrowEl.addEventListener("click", () => {
        if (i === 0) {
            console.log(i);
            return
        }
        i -= 1;
        i = i % rulesProgress.length;
    
        updateRulesProgress(i);
    })
}
if (rightArrowEl) {
    rightArrowEl.addEventListener("click", () => {
        if (i === rulesProgress.length - 1) {
            console.log(i);
            return
        }
    
        i += 1;
        i = i % rulesProgress.length;
    
        updateRulesProgress(i);
    })
}

const rulesProgress = Array.from(document.getElementsByClassName("rules-progress-dot"));
function updateRulesProgress(i) {
    for (let k=0; k < rulesProgress.length; k++) {
        if (k === i) {
            rulesProgress[k].style.backgroundColor = `var(--secondary-main)`
        }
        else {
            rulesProgress[k].style.backgroundColor = `var(--primary-main)`
        }
    }

    if (i === rulesProgress.length - 1) {
        rightArrowEl.style.opacity = "0";
    }
    else {
        rightArrowEl.style.opacity = "1";
    }

    if (i === 0) {
        leftArrowEl.style.opacity = "0";
    }
    else {
        leftArrowEl.style.opacity = "1";
    }
}

// Themes
const themeBtnEl = document.getElementById("theme-btn");
const themes = ["dark", "light"];
let themesIndex = localStorage.getItem("themesIndex");
if (!themesIndex) {
    themesIndex = 0;
    localStorage.setItem("themesIndex", themesIndex);
} else {
    themesIndex = parseInt(themesIndex, 10); // Convert the retrieved string to an integer
}

function themesBtnFunction() {
    themesIndex += 1
    if (themesIndex == themes.length) {
        themesIndex = 0;
    }

    const root = document.documentElement;

    root.style.setProperty(`--background-main`, `var(--background-${themes[themesIndex]})`);
    root.style.setProperty(`--primary-main`, `var(--primary-${themes[themesIndex]})`);
    root.style.setProperty(`--secondary-main`, `var(--secondary-${themes[themesIndex]})`);
    root.style.setProperty(`--overlay-background-main`, `var(--overlay-background-${themes[themesIndex]})`);
    root.style.setProperty(`--X1-main`, `var(--X1-${themes[themesIndex]})`);
    root.style.setProperty(`--X2-main`, `var(--X2-${themes[themesIndex]})`);
    root.style.setProperty(`--O1-main`, `var(--O1-${themes[themesIndex]})`);
    root.style.setProperty(`--O2-main`, `var(--O2-${themes[themesIndex]})`);

}

themeBtnEl.addEventListener("click", themesBtnFunction)



// Notification
const notificationContainerEl = document.getElementById("notification-container");
const notificationTextEl = document.getElementById("notification-text");

document.addEventListener("keydown", (event) => {
    if (event.key === "1") {
        createNotification("test")
    }
})

const highlightOverlayContainer = document.getElementById("highlight-overlay-container");
function createNotification(text="This is an example notification. This is a longer notification", time=2000) {
    notificationTextEl.textContent = text;

    let highlightOverlayContainerDisplay = window.getComputedStyle(highlightOverlayContainer).display;

    notificationContainerEl.classList.remove("fade-out-350");
    notificationContainerEl.classList.add("fade-in-350");
    notificationContainerEl.style.display = "flex";

    highlightOverlayContainer.classList.remove("fade-out-350");
    highlightOverlayContainer.classList.add("fade-in-350");
    highlightOverlayContainer.style.display = "flex";

    setTimeout(() =>{
        notificationContainerEl.classList.remove("fade-in-350");
        highlightOverlayContainer.classList.remove("fade-in-350");
        
        notificationContainerEl.classList.add("fade-out-350");

        if (highlightOverlayContainerDisplay === "none") {
            highlightOverlayContainer.classList.add("fade-out-350");
        }
        setTimeout(() => {
            notificationContainerEl.style.display = "none";

            if (highlightOverlayContainerDisplay === "none") {
                highlightOverlayContainer.style.display = "none";
            }
        }, 300)
    }, time) 
}

// Game title home button
const gameTitleEl = document.getElementById("game-title-container");
if (gameTitleEl) {
    gameTitleEl.style.cursor = "pointer";
    gameTitleEl.addEventListener("click", () => {
        window.location.href = "/"
    })
}

// Footer buttons
const footerRightBtnEls = Array.from(document.getElementsByClassName("footer-hyperlink"));

for (let footerBtnEl of footerRightBtnEls) {
    footerBtnEl.style.border = "none";

    let hyperlink = footerBtnEl.getAttribute("link");

    footerBtnEl.addEventListener("click", () => {
        window.open(hyperlink, "_blank")
    })
}

const footerLeftBtnEls = Array.from(document.getElementsByClassName("footer-btn"));

for (let footerBtnEl of footerLeftBtnEls) {
    let hyperlink = footerBtnEl.getAttribute("link");

    footerBtnEl.addEventListener("click", () => {
        window.open(hyperlink, "_blank")
    })
}

const downArrowEl = document.getElementById("down-arrow");

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY || window.pageYOffset;
    var windowHeight = window.innerHeight;
    var bodyHeight = document.body.clientHeight;
    
    // Check if user has scrolled to the bottom
    if (scrollPosition + windowHeight >= bodyHeight) {
        if (window.getComputedStyle(downArrowEl).display !== "none") {
            downArrowEl.classList.add("fade-out-350");
            
            setTimeout(() => {
                downArrowEl.style.display = "none";
            }, 348)
        }
    }
});




// Helper functions
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

function setupGrid(game, mode="local") {
    console.log("setup");
    gameArr = game.gameArray;
    moves = game.moves;

    if (moves.length >= 6) {
        removeMove = moves[moves.length - 7];
        warningMove = moves[moves.length - 6];

        if (removeMove) {
            if (mode === "local") {
                gameArr[removeMove.id] = "";
            }
            updateGridSquare(removeMove.id, removeMove.symbol, fadeIn=false, fadeOut=true);
        }

        winner = checkWinner(gameArr);
        console.log(winner);
        if (!winner && warningMove) {
            updateWarningMove(warningMove.id, warningMove.symbol);
        }

        else if (winner) {
            winnerFunction(winner);
            return;
        }
    }

    currentTurn = findNextTurn(moves);
    updateTurnCount(moves);
    updateTurnLabelSymbol(currentTurn);
    addGridEventListeners(true);
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
            "combo": [a,b,c]};
        }
    }

    // If no winner is found after checking all combinations, return null
    return null;
}

function winnerFunction(winner) {
    let id; let combo;

    if (winner) {
        id = winner.id;
        combo = winner.combo;
    }

    console.log(`${id} wins by ${combo}`);
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


// Turn label and turn count
const turnCountEl = document.getElementById("turn-count-number");
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

function updateTurnCount(moves) {
    let turnCount = moves.length;

    turnCountEl.classList.add("fade-out-350");
    turnCountEl.classList.remove("fade-in-350")
    setTimeout(() => {
        turnCountEl.textContent = turnCount;
        turnCountEl.classList.add("fade-in-350");
        turnCountEl.classList.remove("fade-out-350");
    }, 348)
}


// Randomize colors
randomizeHighlightCols();

function randomizeHighlightCols() {
    // [green, pink, purple, orange, blue, yellow]
    let colors = ["#89fc00", "#ff006e", "#9016d2", "#ff5714", "#00bbf9", "#fbff12"];

    for (let i=0; i<=8; i++) {
        let randomColor = colors[getRandomInt(0, colors.length - 1)];
        document.documentElement.style.setProperty(`--highlight-col-${i}`, randomColor);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}